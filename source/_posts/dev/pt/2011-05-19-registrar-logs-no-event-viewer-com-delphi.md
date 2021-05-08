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

Pessoal, estudando formas de gravar logs da aplica&#231;&#227;o, me lembrei do **Event Viewer** do **Windows**, tempo atr&#225;s utilizava classes do **.Net** em **C#** para fazer este logs e n&#227;o mais em arquivos textos. Resolvi estudar se era poss&#237;vel utilizar a mesma t&#233;cnica em **Delphi XE** e descobri que sim achei interessante compartilhar com voc&#234;s. Vale lembrar que n&#227;o &#233; algo novo, funciona em vers&#245;es anteriores do **Delphi**.

<!--more-->

E para n&#227;o ficar apenas em um exemplo de como utilizar o **Event Viewer** com **Delphi**, desenvolvi toda uma estrutura de logs de mensagens utilizando **Interfaces**, onde ficar&#225; f&#225;cil caso queiram mudar a forma de grava&#231;&#227;o dos logs das aplica&#231;&#245;es de voc&#234;s, e tamb&#233;m, estou utilizando neste exemplo uma arquitetura onde ser&#225; f&#225;cil aplicar **IoC** (**Invers&#227;o de Controle**) e **DI** (**Inje&#231;&#227;o de Depend&#234;ncias**), vou deixar para falar deste dois Padr&#245;es em outro post.

O primeiro c&#243;digo &#233; o nosso **enumerator**, que ir&#225; conter os tipos poss&#237;veis de log das mensagens da aplica&#231;&#227;o. N&#227;o &#233; necess&#225;rio separar este **enumerator** da **unit** que ir&#225; conter a nossa **interface** descrita abaixo, fiz est&#225; separa&#231;&#227;o apenas para organizar melhor os arquivos da aplica&#231;&#227;o.

{% codeblock TLogType.pas lang:delphi line_number:true highlight:true %}
unit LogType;

interface

type
  TLogType = (Information, Warning, Error);

implementation

end.
{% endcodeblock %}

O segundo c&#243;digo &#233; a nossa **Interface** (Contrato), onde todas as classes que ir&#227;o realizar logs dever&#227;o. Note que estou utilizando **summary**, ele &#233; usado para descrever informa&#231;&#245;es sobre o **tipo** ou **membros do tipo**, para quando formos utilizar j&#225; venha &#224; defini&#231;&#227;o do **tipo** no **Intellisense** como **tipos** pr&#243;prio **Delphi** e tamb&#233;m &#233; uma forma de documenta&#231;&#227;o do c&#243;digo fonte.

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

Abaixo a implementa&#231;&#227;o da nossa classe que ser&#225; respons&#225;vel por registrar os logs no **Event Viewer** do **Windows**. N&#227;o h&#225; muito que comentar do c&#243;digo apenas que estou utilizando um arquivo ***.ini**, localizado no path da aplica&#231;&#227;o para guardar as configura&#231;&#245;es do sistema e que n&#227;o estou usando **Strategy Pattern**, vou deixar o c&#243;digo da forma que est&#225; para refatorar ele e explicar melhor este Pattern em outro artigo.

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

Abaixo a implementa&#231;&#227;o da nossa classe que ser&#225; respons&#225;vel por registrar os logs em **arquivo texto**. A &#250;nica considera&#231;&#227;o &#233; que estou utilizando o m&#233;todo **WriteAllText** da classe **TFile** contida na nova unit **IOUtils** para **IO** (input/output) do **Delphi**, este m&#233;todo sempre sobrescreve o conte&#250;do do arquivo (n&#227;o &#233; recomendado o uso para realizar logs j&#225; que n&#227;o grava a informa&#231;&#227;o que j&#225; existia no arquivo, estou utilizando apenas como exemplo), tamb&#233;m verifica se existe criado no disco caso n&#227;o existe ele j&#225; cria automaticamente.

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

Caso queiram gravar os logs tamb&#233;m em **banco de dados** ou deixar j&#225; uma classe que permita est&#225; a&#231;&#227;o, &#233; necess&#225;rio apenas implementar a forma de acesso e grava&#231;&#227;o no **banco de dados** dentro do m&#233;todo **Write**, voc&#234;s ir&#227;o notar mais abaixo que a forma de utiliza&#231;&#227;o da classe n&#227;o ir&#225; mudar.

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

Abaixo o c&#243;digo da nossa classe que ser&#225; respons&#225;vel por gerenciar os logs da aplica&#231;&#227;o. Note que existem dois m&#233;todos **Create**, um est&#225; recebendo uma vari&#225;vel **ILogger** que &#233; a nossa **interface** que cont&#233;m os m&#233;todos respons&#225;veis por fazer o log da aplica&#231;&#227;o, este &#233; um exemplo de **IoC**. E o outro m&#233;todo **Create** ir&#225; chamar o m&#233;todo descrito acima passando a forma de autentica&#231;&#227;o que ser&#225; utilizada na aplica&#231;&#227;o por padr&#227;o, este &#233; um exemplo de **DI**. Da forma que foi desenvolvida est&#225; classe fica f&#225;cil usar um **Container de Depend&#234;ncias** que ser&#225; assuntos de outro post.

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

Para utilizar as nossas classes de log &#233; necess&#225;rio antes colocar no **uses** as **units** abaixo.

{% codeblock lang:delphi line_number:true highlight:true %}
uses
  Logger, LogManager, LoggerEventViewer;
{% endcodeblock %}

Existem duas formas de utilizar a nossa classe **LogManager**. A primeira forma, &#233; apenas instanciar o nosso objeto **logManager** do tipo **TLogManager** sem passar nenhum objeto no construtor, sendo assim a nossa classe ser&#225; respons&#225;vel por instanciar a vari&#225;vel do tipo **ILogger** com a classe padr&#227;o de realizar logs do sistema. Segue abaixo um exemplo.

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

A segunda forma &#233; criar uma vari&#225;vel do tipo **ILogger** e depois instanciar este objeto com a classe na qual deseja realizar o log da aplica&#231;&#227;o, e passar como parametro no construtor do m&#233;todo Create da classe TLogManager. Note que a forma de utiliza&#231;&#227;o &#233; a mesma para todos os casos, o que altera &#233; apenas a classe que ir&#225; instanciar o nosso objeto, com isto, mudar a forma que se realiza o log e a manuten&#231;&#227;o do c&#243;digo se torna muito mais simples e f&#225;cil. Segue abaixo um exemplo.

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

Abaixo as configura&#231;&#245;es do nosso arquivo de configura&#231;&#227;o **Config.ini** localizado junto ao execut&#225;vel do projeto.

{% codeblock Config.ini lang:delphi line_number:true highlight:true %}
[Application]
//Caminho que sera gravado o arquivo de log.
LoggerFilePath='C:\EstudoDelphi.txt'

//Nome da fonte do Event Viewer.
LoggerEventSource='EstudoDelphi'
{% endcodeblock %}

Para abrir o Event Viewer do Windows, basta ir no **Executar** e digitar: **eventvwr.msc**.

Se quiserem o c&#243;digo fonte do exemplo, &#233; s&#243; clicar <a href="http://www.activedelphi.com.br/imagens/artigos/reg_log_event_viewer/RegLogEventViewer.zip" target="_blank" rel="external noopener">aqui</a>. Espero que tenham gostado deste artigo. Agrade&#231;o a visita.
