---
layout: post/index
title: "Registrar Logs no Event Viewer com Delphi"
date: 2011-05-19
comments: true
categories: 
- dev
tags: 
- delphi
- di
- ioc
lang: pt
---

Pessoal, estudando formas de gravar logs da aplicação, me lembrei do **Event Viewer** do **Windows**, tempo atrás utilizava classes do **.Net** em **C#** para fazer este logs e não mais em arquivos textos. Resolvi estudar se era possível utilizar a mesma técnica em **Delphi XE** e descobri que sim achei interessante compartilhar com vocês. Vale lembrar que não é algo novo, funciona em versões anteriores do **Delphi**.

<!--more-->

E para não ficar apenas em um exemplo de como utilizar o **Event Viewer** com **Delphi**, desenvolvi toda uma estrutura de logs de mensagens utilizando **Interfaces**, onde ficará fácil caso queiram mudar a forma de gravação dos logs das aplicações de vocês, e também, estou utilizando neste exemplo uma arquitetura onde será fácil aplicar **IoC** (**Inversão de Controle**) e **DI** (**Injeção de Dependências**), vou deixar para falar deste dois Padrões em outro post.

O primeiro código é o nosso **enumerator**, que irá conter os tipos possíveis de log das mensagens da aplicação. Não é necessário separar este **enumerator** da **unit** que irá conter a nossa **interface** descrita abaixo, fiz está separação apenas para organizar melhor os arquivos da aplicação.

{% codeblock TLogType.pas lang:delphi line_number:true highlight:true %}
unit LogType;

interface

type
  TLogType = (Information, Warning, Error);

implementation

end.
{% endcodeblock %}

O segundo código é a nossa **Interface** (Contrato), onde todas as classes que irão realizar logs deverão. Note que estou utilizando **summary**, ele é usado para descrever informações sobre o **tipo** ou **membros do tipo**, para quando formos utilizar já venha à definição do **tipo** no **Intellisense** como **tipos** próprio **Delphi** e também é uma forma de documentação do código fonte.

{% codeblock ILogger.pas lang:delphi line_number:true highlight:true %}
unit Logger;

interface

uses
  LogType;

type
  ILogger = interface
    /// <summary>
    /// Registra os logs.
    /// </summary>
    /// <param name="message">Mensagem que sera registrada.</param>
    /// <param name="logType">Tipo do log.</param>
    procedure Write(message: string; logType: TLogType);
  end;

implementation

end.
{% endcodeblock %}

Abaixo a implementação da nossa classe que será responsável por registrar os logs no **Event Viewer** do **Windows**. Não há muito que comentar do código apenas que estou utilizando um arquivo ***.ini**, localizado no path da aplicação para guardar as configurações do sistema e que não estou usando **Strategy Pattern**, vou deixar o código da forma que está para refatorar ele e explicar melhor este Pattern em outro artigo.

{% codeblock TLoggerEventViewer.pas lang:delphi line_number:true highlight:true %}
unit LoggerEventViewer;

interface

uses
  Forms, IniFiles, SysUtils, SvcMgr, Windows, Logger, LogType;

type
  TLoggerEventViewer = class(TInterfacedObject, ILogger)
  public
    { Public declarations }
    procedure Write(message: string; logType: TLogType);

  end;

implementation

{ TEventView }

procedure TLoggerEventViewer.Write(message: string; logType: TLogType);
var
  iniFiles: TIniFile;
  eventLogger: TEventLogger;

begin
  iniFiles := TIniFile.Create(Format('%s%s', [ExtractFilePath(Forms.Application.ExeName), 'Config.ini']));
  eventLogger := TEventLogger.Create(iniFiles.ReadString('Application', 'LoggerEventSource', ''));
  try
    case logType of
      TLogType.Error:
        eventLogger.LogMessage(message, EVENTLOG_ERROR_TYPE, 0, 0);

      TLogType.Warning:
        eventLogger.LogMessage(message, EVENTLOG_WARNING_TYPE, 0, 0);

      TLogType.Information:
        eventLogger.LogMessage(message, EVENTLOG_INFORMATION_TYPE, 0, 0);
    end;
  finally
    iniFiles.Free();
    FreeAndNil(eventLogger);
  end;
end;

end.
{% endcodeblock %}

Abaixo a implementação da nossa classe que será responsável por registrar os logs em **arquivo texto**. A única consideração é que estou utilizando o método **WriteAllText** da classe **TFile** contida na nova unit **IOUtils** para **IO** (input/output) do **Delphi**, este método sempre sobrescreve o conteúdo do arquivo (não é recomendado o uso para realizar logs já que não grava a informação que já existia no arquivo, estou utilizando apenas como exemplo), também verifica se existe criado no disco caso não existe ele já cria automaticamente.

{% codeblock TLoggerFileText.pas lang:delphi line_number:true highlight:true %}
unit LoggerFileText;

interface

uses
  Forms, IniFiles, IOUtils, TypInfo, SysUtils, Logger, LogType;

type
  TLoggerFileText = class(TInterfacedObject, ILogger)
  public
    { Public declarations }
    procedure Write(message: string; logType: TLogType);

  end;

implementation

{ TEventView }

procedure TLoggerFileText.Write(message: string; logType: TLogType);
var
  iniFile: TIniFile;

begin
  message := Format('%s - %s', [GetEnumName(TypeInfo(TLogType), Integer(logType)), message]);
  iniFile := TIniFile.Create(Format('%s%s', [ExtractFilePath(Application.ExeName), 'Config.ini']));
  try
    TFile.WriteAllText(iniFile.ReadString('Application', 'LoggerFilePath', ''), message);
  finally
    iniFile.Free();
  end;
end;

end.
{% endcodeblock %}

Caso queiram gravar os logs também em **banco de dados** ou deixar já uma classe que permita está ação, é necessário apenas implementar a forma de acesso e gravação no **banco de dados** dentro do método **Write**, vocês irão notar mais abaixo que a forma de utilização da classe não irá mudar.

{% codeblock TLoggerDatabase.pas lang:delphi line_number:true highlight:true %}
unit LoggerDatabase;

interface

uses
  Logger, LogType;

type
  TLoggerDatabase = class(TInterfacedObject, ILogger)
  public
    { Public declarations }
    procedure Write(message: string; logType: TLogType);

  end;

implementation

{ TEventView }

procedure TLoggerDatabase.Write(message: string; logType: TLogType);
begin
  { Implementar a forma de acesso e gravacao na base de dados. }
end;

end.
{% endcodeblock %}

Abaixo o código da nossa classe que será responsável por gerenciar os logs da aplicação. Note que existem dois métodos **Create**, um está recebendo uma variável **ILogger** que é a nossa **interface** que contém os métodos responsáveis por fazer o log da aplicação, este é um exemplo de **IoC**. E o outro método **Create** irá chamar o método descrito acima passando a forma de autenticação que será utilizada na aplicação por padrão, este é um exemplo de **DI**. Da forma que foi desenvolvida está classe fica fácil usar um **Container de Dependências** que será assuntos de outro post.

{% codeblock TLogManager.pas lang:delphi line_number:true highlight:true %}
unit LogManager;

interface

uses
  Logger, LogType;

type
  TLogManager = class
  private
    { Private declarations}
    _logger: ILogger;

  public
    { Public declarations }

    /// <summary>
    ///
    /// </summary>
    /// <param name="logger"></param>
    constructor Create(const logger: ILogger); overload;

    /// <summary>
    ///
    /// </summary>
    constructor Create(); overload;

    /// <summary>
    /// Registra os logs do tipo informacao.
    /// </summary>
    /// <param name="message">Informacao que sera registrada.</param>
    procedure WriteInfo(message: string);

    /// <summary>
    /// Registra os logs do tipo atencao.
    /// </summary>
    /// <param name="message">Mensagem de atencao que sera registrada.</param>
    procedure WriteWarning(message: string);

    /// <summary>
    /// Registra os logs do tipo erro.
    /// </summary>
    /// <param name="message">Erro que sera registrado.</param>
    procedure WriteError(message: string);

  end;

implementation

uses
  LoggerEventViewer, LoggerFileText;

{ TLogManager }

constructor TLogManager.Create(const logger: ILogger);
begin
  _logger := logger;
end;

constructor TLogManager.Create();
begin
  Create(TLoggerFileText.Create());
end;

procedure TLogManager.WriteInfo(message: string);
begin
  _logger.Write(message, TLogType.Information);
end;

procedure TLogManager.WriteWarning(message: string);
begin
  _logger.Write(message, TLogType.Warning);
end;

procedure TLogManager.WriteError(message: string);
begin
  _logger.Write(message, TLogType.Error);
end;

end.
{% endcodeblock %}

Para utilizar as nossas classes de log é necessário antes colocar no **uses** as **units** abaixo.

{% codeblock lang:delphi line_number:true highlight:true %}
uses
  Logger, LogManager, LoggerEventViewer;
{% endcodeblock %}

Existem duas formas de utilizar a nossa classe **LogManager**. A primeira forma, é apenas instanciar o nosso objeto **logManager** do tipo **TLogManager** sem passar nenhum objeto no construtor, sendo assim a nossa classe será responsável por instanciar a variável do tipo **ILogger** com a classe padrão de realizar logs do sistema. Segue abaixo um exemplo.

{% codeblock lang:delphi line_number:true highlight:true %}
var
  logManager: TLogManager;

begin
  logManager := TLogManager.Create();
  try
    logManager.WriteInfo('Mensagem de info do projeto de estudo!');
    logManager.WriteWarning('Mensagem de warning do projeto de estudo!');
    logManager.WriteError('Mensagem de error do projeto de estudo!');
  finally
    FreeAndNil(logManager);
  end;
end;
{% endcodeblock %}

A segunda forma é criar uma variável do tipo **ILogger** e depois instanciar este objeto com a classe na qual deseja realizar o log da aplicação, e passar como parametro no construtor do método Create da classe TLogManager. Note que a forma de utilização é a mesma para todos os casos, o que altera é apenas a classe que irá instanciar o nosso objeto, com isto, mudar a forma que se realiza o log e a manutenção do código se torna muito mais simples e fácil. Segue abaixo um exemplo.

{% codeblock lang:delphi line_number:true highlight:true %}
var
  logger: ILogger;
  logManager: TLogManager;

begin
  logger := TLoggerEventViewer.Create();
  logManager := TLogManager.Create(logger);
  try
    logManager.WriteInfo('Mensagem de info do projeto de estudo!');
    logManager.WriteWarning('Mensagem de warning do projeto de estudo!');
    logManager.WriteError('Mensagem de error do projeto de estudo!');
  finally
    FreeAndNil(logManager);
  end;
end;
{% endcodeblock %}

Abaixo as configurações do nosso arquivo de configuração **Config.ini** localizado junto ao executável do projeto.

{% codeblock Config.ini lang:delphi line_number:true highlight:true %}
[Application]
//Caminho que sera gravado o arquivo de log.
LoggerFilePath='C:\EstudoDelphi.txt'

//Nome da fonte do Event Viewer.
LoggerEventSource='EstudoDelphi'
{% endcodeblock %}

Para abrir o Event Viewer do Windows, basta ir no **Executar** e digitar: **eventvwr.msc**.

Se quiserem o código fonte do exemplo, é só clicar <a href="http://www.activedelphi.com.br/imagens/artigos/reg_log_event_viewer/RegLogEventViewer.zip" target="_blank" rel="external noopener">aqui</a>. Espero que tenham gostado deste artigo. Agradeço a visita.
