---
layout: post/index
title: "JSON (JavaScript Object Notation) e Generics no Delphi"
date: 2010-11-18
comments: true
categories: 
- dev
tags: 
- delphi
- generics
- json
lang: pt
---

Olá pessoal, mais um post sobre Delphi desta vez um demonstrar duas novas tecnologias que está sendo muito melhoradas no Delphi deste a versão 2009 até a ultima versão o Delphi XE.

<!--more-->

**Generics** é uma forma de poder passar parâmetro de tipos para classes e métodos possibilitando assim reutilização de código por exemplo e <a href="http://www.json.org/json-pt.html" target="_blank" rel="external noopener">JSON</a> (JavaScript Object Notation) é uma forma de troca de dados entre aplicações semelhante ao **XML** porém com uma sintaxe bem mais simples e leve. O Delphi XE como algumas versões anteriores dá suporte a implementação usando **JSON**, em nosso exemplo vamos criar um método totalmente genêrico que recebe um objeto e um tipo e vamos usar o **JSON** para formatar este objeto e gravar no disco usando a nova classe de **IO** (input/output) do Delphi e um método de leitura deste arquivo no formato **JSON** e retornar o mesmo a um Objeto novamente passando o tipo do objeto e o caminho onde se encontra o arquivo.

Primeiro vamos criar uma nova classe do tipo TPessoa.

{% codeblock TPessoa.pas lang:delphi line_number:true highlight:true %}
type
  TPessoa = class
  private
    { Private declarations }
    FPessIden: Integer;
    FPessNome: string;

  public
    { Published declarations }
    property PessIden: Integer read FPessIden write FPessIden;
    property PessNome: string read FPessNome write FPessNome;

  end;
{% endcodeblock %}

Para conseguirmos desenvolver nossos métodos temos antes que adicionar ao uses as **unit's** sitadas abaixo, acima de cada unit tem a descrição de sua função no projeto.

{% codeblock TPessoa.pas lang:delphi line_number:true highlight:true %}
uses
  SysUtils,

  { Unit que contem os novos metodos de I/O }
  IOUtils,

  { Unit's necessarioas para usar JSON }
  DBXJSONReflect, DBXJSON,

  { Unit necessaria para usar Generic }
  Generics.Collections;
{% endcodeblock %}

Agora vamos criar nossa classe que irá conter os métos necessários para carregar e salvar os dados no disco. O **class** antes da **function** indica que estes métodos serão státicos não é necessário instânciar a classe **TJSONTools** para usar estes métodos e a descrição **T : class** indica que este método recebe um tipo e que a variável **obj** passada por parâmetro é deste tipo, e na outra função que ela retorna o tipo especificado.

{% codeblock TJSONTools.pas lang:delphi line_number:true highlight:true %}
type
  TJSONTools = class
    public
    { Public declarations }
    class function saveFileJSON<T : class>(obj: T; const filePath: string): Boolean;
    class function loadFileJSON<T : class>(const filePath: string): T;

  end;
{% endcodeblock %}

Agora nosso método que irá gravar no disco o objeto da classe descrita acima.

{% codeblock TJSONMarshal.pas lang:delphi line_number:true highlight:true %}
class function TJSONTools.saveFileJSON<T>(obj: T; const filePath: string): Boolean;
var
  Marshal: TJSONMarshal;

begin
  Marshal := TJSONMarshal.Create(TJSONConverter.Create());
  try
    try
      TFile.WriteAllText(filePath, (Marshal.Marshal(obj) as TObject).ToString);

      Result := True;
    except
      Result := False;
    end;
  finally
    FreeAndNil(Marshal);
  end;
end;
{% endcodeblock %}

Agora o método responsável por ler o arquivo e carregar novamente os dados para um objeto.

{% codeblock TJSONTools.pas lang:delphi line_number:true highlight:true %}
class function TJSONTools.loadFileJSON<T>(const filePath: string): T;
var
  Unmarshal: TJSONUnMarshal;
  obj: TJSONObject;

begin
  Unmarshal := TJSONUnMarshal.Create();
  try
    try
      if not(FileExists(filePath)) then
        Exit(nil);

      obj := TJSONObject.ParseJSONValue(TEncoding.ASCII.GetBytes(TFile.ReadAllText(filePath)), 0) as TJSONObject;

      Result := T(Unmarshal.Unmarshal(obj));
    except
      Exit(nil);
    end;
  finally
    FreeAndNil(Unmarshal);
  end;
end;
{% endcodeblock %}

Agora uma forma de poder usar nossa classe.

{% codeblock TPessoa.pas lang:delphi line_number:true highlight:true %}
var
  objPessoa: TPessoa;

begin
  objPessoa:= TPessoa.Create();
  objPessoa.PessIden := 1;
  objPessoa.PessNome := 'A Junior';

  if (TJSONTools.saveFileJSON<TPessoa>(objPessoa, 'C:\pessoa.txt')) then
    ShowMessage('Criou o arquivo no caminho: ' + #13 + ' C:\pessoa.txt');

  objPessoa := TJSONTools.loadFileJSON<TPessoa>('C:\pessoa.txt');
  if (Assigned(objPessoa)) then
  begin
    ShowMessage(
      'PessIden: ' + IntToStr(objPessoa.PessIden) + #13 +
      'PessNome: ' + objPessoa.PessNome
    );
  end
  else
    ShowMessage('Nao foi possivel des-serializar o objeto');
end;
{% endcodeblock %}

Este foi apenas um exemplo didático usando **JSON** e **Generics** no Delphi estes métodos ainda podem ser refatorados e criado validações para tratar possiveis erros de parâmetros que podem ser identificados criando testes unitários sobres estes métodos. Obrigado pela visita e até a próxima.
