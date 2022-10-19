---
layout: post/index
title: "RTTI (Run-Time Type Information) no Delphi"
date: 2010-07-31
comments: true
categories: 
- dev
tags: 
- delphi
- rtti
lang: pt
---

RTTI (Run-Time Type Information) é uma técnica utilizada para identificar tipo de objetos armazenados em memória em tempo de execução.

<!--more-->

Abaixo um exemplo de como utilizar RTTI em sua aplicação, este exemplo é apenas uma idéia de como usar RTTI para criar classes e métodos genêricos de acesso a base de dados.

O primeiro código é de uma classe genêrica de modelo da estrutura da tabela no banco de dados. Note que a mesma herda da classe TPersistent pois nela existe as directivas de compilação **{$M+}** (**{$METHODINFO ON}**) e **{$M-}** (**{$METHODINFO OFF}**) necessárias para implementar o acesso dos dados em memória.

{% codeblock TModel.pas lang:delphi line_number:true highlight:true %}
type
  TModel = class(TPersistent)
    private
      { Private declarations }

    public
      { Public declarations }
      constructor Create(); virtual;
      destructor Destroy(); override;

  end;
{% endcodeblock %}

O segundo código é de uma classe de modelo da estrutura da tabela Pessoa do banco de dados, note que ela herda a classe **TModel** e que suas propridades estão declaradas na sessão **published** pois assim é possível acessa-lás em tempo de execução.

{% codeblock TModelPessoa.pas lang:delphi line_number:true highlight:true %}
type
  TModelPessoa = class(TModel)
    private
      { Private declarations }
      FPessIden: Integer;
      FPessNome: String;

    public
      { Public declarations }
      constructor Create(); override;
      destructor Destroy(); override;

    published
      { Published declarations }
      property PessIden: Integer read FPessIden write FPessIden;
      property PessNome: String read FPessNome write FPessNome;

  end;
{% endcodeblock %}

O terceiro código é de uma classe teria os métodos de operação na base de dados porém eu retirei pois este não é o foco deste post e sim apenas mostrar uma utilização do RTTI. Então vamos a explicação, o método **fillProperty** é responsável por verificar as propriedades do objeto do tipo ou que herde a classe **TModel** passado por parâmetro. Outro detalhe importante é a declaração da unit **TypInfo** que contém os métodos responsáveis em acessar os dados em memória.

{% codeblock TController.pas lang:delphi line_number:true highlight:true %}
uses
  TypInfo, Dialogs, Classes, Model;

type
  TController = class(TObject)
    private
      { Private declarations }

    public
      { Public declarations }
      constructor Create(); virtual;
      destructor Destroy(); override;
      procedure fillProperties(model: TModel);

  end;
{% endcodeblock %}

Como descrito anteriomente o método responsável por acessar os dados em memória do objeto em tempo de execução. Note que após o termino do **for** foi inserido um **ShowMessage(msg.Text);** para informar ao usuário as propriedades e o valor das propriedades do objeto passado por parâmetro.

{% codeblock TController.pas lang:delphi line_number:true highlight:true %}
procedure TController.fillProperties(model: TModel);
var
  listProp: PPropList;
  listPropCount, i: Integer;
  propInfo: TPropInfo;
  valueProp: Variant;
  msg: TStringList;
begin
  {Obtem informacoes dos atributos que sao Publisheds}
  listPropCount:= GetPropList(model.ClassInfo, tkAny, nil);
  GetMem(listProp, listPropCount * SizeOf(TPropInfo));

  try
    msg:= TStringList.Create();

    GetPropList(model, listProp);
    for i:= 0 to Pred(listPropCount) do
    begin
      {Obtem informacoes da propriedade}
      propInfo:= TPropInfo(listProp^[i]^);
      valueProp:= GetPropValue(model, propInfo.Name);

      msg.Add(Format('%s: %s;', [propInfo.Name, valueProp]));
    end;

    ShowMessage(msg.Text);
  finally
    FreeAndNil(msg);
    FreeMem(listProp);
  end;
end;
{% endcodeblock %}

E por fim um trecho de código para você adicionar ao evento de um **button** por exemplo de como utilizar o método **fillProperties** da classe **TController**.

{% codeblock TController.pas lang:delphi line_number:true highlight:true %}
var
  modelPessoa: TModelPessoa;
  controller: TController;
begin
  try
    modelPessoa:= TModelPessoa.Create();
    controller := TController.Create();
    modelPessoa.PessIden:= StrToInt(self.edtPessIden.Text);
    modelPessoa.PessNome:= self.edtPessNome.Text;

    controller.fillProperties(modelPessoa);
  finally
    FreeAndNil(modelPessoa);
    FreeAndNil(controller);
  end;
end;
{% endcodeblock %}

Espero que gostem e seja útil de alguma forma este exemplo. Em breve estárei postando uma aplicação mais real da utilização do RTTI para criação de classes e métodos genêricos de acesso a dados, lembrando que este não é a única utilização do RTTI.

Desde já agredeço a visita.
