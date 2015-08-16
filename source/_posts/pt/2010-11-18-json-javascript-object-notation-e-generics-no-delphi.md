---
layout: post
title: JSON (JavaScript Object Notation) e Generics no Delphi
description: Blog pessoal com assuntos dedicados a desenvolvimento de software nas linguagens de programação C Sharp, Delphi, ASP .NET, PHP e Javascript.
date: 2010-11-18 09:19
comments: true
categories: 
- desenvolvimento
- delphi
tags: 
- delphi
- generics
- json
lang: pt
---

Ol&#225; pessoal, mais um post sobre Delphi desta vez um demonstrar duas novas tecnologias que est&#225; sendo muito melhoradas no Delphi deste a vers&#227;o 2009 at&#233; a ultima vers&#227;o o Delphi XE.

**Generics** &#233; uma forma de poder passar par&#226;metro de tipos para classes e m&#233;todos possibilitando assim reutiliza&#231;&#227;o de c&#243;digo por exemplo e <a href="http://www.json.org/json-pt.html" target="_blank" rel="external noopener">JSON</a> (JavaScript Object Notation) &#233; uma forma de troca de dados entre aplica&#231;&#245;es semelhante ao **XML** por&#233;m com uma sintaxe bem mais simples e leve. O Delphi XE como algumas vers&#245;es anteriores d&#225; suporte a implementa&#231;&#227;o usando **JSON**, em nosso exemplo vamos criar um m&#233;todo totalmente gen&#234;rico que recebe um objeto e um tipo e vamos usar o **JSON** para formatar este objeto e gravar no disco usando a nova classe de **IO** (input/output) do Delphi e um m&#233;todo de leitura deste arquivo no formato **JSON** e retornar o mesmo a um Objeto novamente passando o tipo do objeto e o caminho onde se encontra o arquivo.

<!--more-->

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

Para conseguirmos desenvolver nossos m&#233;todos temos antes que adicionar ao uses as **unit&#39;s** sitadas abaixo, acima de cada unit tem a descri&#231;&#227;o de sua fun&#231;&#227;o no projeto.

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

Agora vamos criar nossa classe que ir&#225; conter os m&#233;tos necess&#225;rios para carregar e salvar os dados no disco. O **class** antes da **function** indica que estes m&#233;todos ser&#227;o st&#225;ticos n&#227;o &#233; necess&#225;rio inst&#226;nciar a classe **TJSONTools** para usar estes m&#233;todos e a descri&#231;&#227;o **T : class** indica que este m&#233;todo recebe um tipo e que a vari&#225;vel **obj** passada por par&#226;metro &#233; deste tipo, e na outra fun&#231;&#227;o que ela retorna o tipo especificado.

{% codeblock TJSONTools.pas lang:delphi line_number:true highlight:true %}
type
  TJSONTools = class
    public
    { Public declarations }
    class function saveFileJSON<T : class>(obj: T; const filePath: string): Boolean;
    class function loadFileJSON<T : class>(const filePath: string): T;

  end;
{% endcodeblock %}

Agora nosso m&#233;todo que ir&#225; gravar no disco o objeto da classe descrita acima.

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

Agora o m&#233;todo respons&#225;vel por ler o arquivo e carregar novamente os dados para um objeto.

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

Este foi apenas um exemplo did&#225;tico usando **JSON** e **Generics** no Delphi estes m&#233;todos ainda podem ser refatorados e criado valida&#231;&#245;es para tratar possiveis erros de par&#226;metros que podem ser identificados criando testes unit&#225;rios sobres estes m&#233;todos. Obrigado pela visita e at&#233; a pr&#243;xima.
