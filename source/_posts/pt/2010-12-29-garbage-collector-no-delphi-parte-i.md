---
layout: post/index
title: "Garbage Collector no Delphi - Parte I"
date: 2010-12-29
comments: true
categories: 
- dev
tags: 
- delphi
lang: pt
---

Ol&#225; pessoal, depois de algum tempo sem postar venho com uma novidade para voc&#234;s, para alguns isto pode n&#227;o ser novidade, mas tenho certeza que para outros &#233;, pelo menos para mim foi novidade, programo em Delphi desde 2005 mais ou menos e fiquei sabendo que o Delphi tinha **Garbage Collector** s&#243; a dias atr&#225;s ent&#227;o resolvi criar uma implementa&#231;&#227;o de exemplo.

<!--more-->

Neste primeiro exemplo vou trabalhar apenas com objetos que herdam de uma classe **Super Classe**.

A primeira implementa&#231;&#227;o &#233; da **Super Classe** na qual todas as outras classes ir&#225; herd&#225;-la, a classe &#233; bem simples ela tem uma interface do **IModel** que &#233; do mesmo tipo da **IUnknown** que ser&#225; respons&#225;vel por dizer que o objeto ser&#225; liberado automaticamente e a classe **TModel** &#233; quem ir&#225; herdar **TInterfacedObject** e a inteface **IUnknown**.

{% codeblock TModel.pas lang:delphi line_number:true highlight:true %}
unit Model;

interface

type
  IModel = type IUnknown;

  TModel = class(TInterfacedObject, IModel)

  end;

implementation

end.
{% endcodeblock %}

A segunda implementa&#231;&#227;o &#233; da **Sub Classe**, ela ir&#225; conter uma interface que ir&#225; conter todos os m&#233;todos necess&#225;rios na classe principal e uma classe que ir&#225; herdar a **Super Classe** e implementar a classe que cont&#233;m os m&#233;todos que ser&#227;o usados na classe.
Note que na frente da declara&#231;&#227;o do m&#233;todo **Destroy** existe um **override** pois o mesmo est&#225; declarado como **virtual** na classe **TObject** o que indica que o mesmo pode ser sobrescrito na **Sub Classe**.

{% codeblock TModelPessoa.pas lang:delphi line_number:true highlight:true %}
unit ModelPessoa;

interface

uses
  Dialogs, Model;

type
  IModelPessoa = interface
    procedure Teste();

  end;

  TModelPessoa = class(TModel, IModelPessoa)
  public
    { Public declarations }
    constructor Create();
    destructor Destroy(); override;
    procedure Teste();

  end;

implementation

{ TModelPessoa }

constructor TModelPessoa.Create();
begin
  ShowMessage('Create');
end;

destructor TModelPessoa.Destroy();
begin
  ShowMessage('Destroy');

  inherited Destroy();
end;

procedure TModelPessoa.Teste();
begin
  ShowMessage('Teste');
end;

end.
{% endcodeblock %}

Pronto agora &#233; s&#243; usar mos, primeiro temos que criar uma vari&#225;vel do tipo da interface da **Sub Classe**, pois &#233; que o coletor ficar&#225; verificando e quando a mesma sair do contexto ser&#225; capturado automaticamente pelo **Garbage Collector**. Depois vamos instanciar esta vari&#225;vel pela classe concreta que implementa a nossa interface para podermos usar o objeto, note que ao instanciar o objeto ir&#225; aparecer a mensagem *"Create"*, apos executar pelo m&#233;todo **Teste()** ir&#225; aparecer a mensagem *"Teste"* e por final quando terminar o m&#233;todo principal na qual foi declarada a vari&#225;vel do tipo da interface da **Sub Classe** ir&#225; aparecer a mensagem *"Destroy"* que indicar&#225; que a nossa vari&#225;vel foi liberada da mem&#243;ria pelo **Garbage Collector** do Delphi.

{% codeblock lang:delphi line_number:true highlight:true %}
var
  objPessoa: IModelPessoa;

begin
  objPessoa := TModelPessoa.Create();
  objPessoa.Teste();
end;
{% endcodeblock %}

Este exemplo foi feito em Delphi XE, caso queria mais uma forma de verificar se a vari&#225;vel foi realmente liberada da mem&#243;ria o Delphi XE tem a propriedade **ReportMemoryLeaksOnShutdown** que mostra os objetos que ainda est&#227;o na mem&#243;ria.
Segue abaixo uma forma de usar esta propriedade.

{% codeblock lang:delphi line_number:true highlight:true %}
program Estudo11;

uses
  Forms,
  Unit8 in 'Unit8.pas' {Form8},
  Model in 'Model.pas',
  ModelPessoa in 'ModelPessoa.pas';

{$R *.res}

begin
  ReportMemoryLeaksOnShutdown := True;

  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TForm8, Form8);
  Application.Run;
end.
{% endcodeblock %}

Espero que este exemplo seja &#250;til a voc&#234;s de alguma forma, at&#233; a pr&#243;xima.
