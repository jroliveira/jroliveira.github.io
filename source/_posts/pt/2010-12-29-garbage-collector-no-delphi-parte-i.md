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

Olá pessoal, depois de algum tempo sem postar venho com uma novidade para vocês, para alguns isto pode não ser novidade, mas tenho certeza que para outros é, pelo menos para mim foi novidade, programo em Delphi desde 2005 mais ou menos e fiquei sabendo que o Delphi tinha **Garbage Collector** só a dias atrás então resolvi criar uma implementação de exemplo.

<!--more-->

Neste primeiro exemplo vou trabalhar apenas com objetos que herdam de uma classe **Super Classe**.

A primeira implementação é da **Super Classe** na qual todas as outras classes irá herdá-la, a classe é bem simples ela tem uma interface do **IModel** que é do mesmo tipo da **IUnknown** que será responsável por dizer que o objeto será liberado automaticamente e a classe **TModel** é quem irá herdar **TInterfacedObject** e a inteface **IUnknown**.

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

A segunda implementação é da **Sub Classe**, ela irá conter uma interface que irá conter todos os métodos necessários na classe principal e uma classe que irá herdar a **Super Classe** e implementar a classe que contém os métodos que serão usados na classe.
Note que na frente da declaração do método **Destroy** existe um **override** pois o mesmo está declarado como **virtual** na classe **TObject** o que indica que o mesmo pode ser sobrescrito na **Sub Classe**.

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

Pronto agora é só usar mos, primeiro temos que criar uma variável do tipo da interface da **Sub Classe**, pois é que o coletor ficará verificando e quando a mesma sair do contexto será capturado automaticamente pelo **Garbage Collector**. Depois vamos instanciar esta variável pela classe concreta que implementa a nossa interface para podermos usar o objeto, note que ao instanciar o objeto irá aparecer a mensagem *"Create"*, apos executar pelo método **Teste()** irá aparecer a mensagem *"Teste"* e por final quando terminar o método principal na qual foi declarada a variável do tipo da interface da **Sub Classe** irá aparecer a mensagem *"Destroy"* que indicará que a nossa variável foi liberada da memória pelo **Garbage Collector** do Delphi.

{% codeblock lang:delphi line_number:true highlight:true %}
var
  objPessoa: IModelPessoa;

begin
  objPessoa := TModelPessoa.Create();
  objPessoa.Teste();
end;
{% endcodeblock %}

Este exemplo foi feito em Delphi XE, caso queria mais uma forma de verificar se a variável foi realmente liberada da memória o Delphi XE tem a propriedade **ReportMemoryLeaksOnShutdown** que mostra os objetos que ainda estão na memória.
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

Espero que este exemplo seja útil a vocês de alguma forma, até a próxima.
