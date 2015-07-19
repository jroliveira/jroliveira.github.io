---
layout: post
title: RTTI (Run-Time Type Information) no Delphi
description: Blog pessoal com assuntos dedicados a desenvolvimento de software nas linguagens de programação C Sharp, Delphi, ASP .NET, PHP e Javascript.
date: 2010-07-31 16:01
comments: true
categories: 
- desenvolvimento
- delphi
tags: 
- delphi
- rtti
lang: pt
---

RTTI (Run-Time Type Information) &#233; uma t&#233;cnica utilizada para identificar tipo de objetos armazenados em mem&#243;ria em tempo de execu&#231;&#227;o.

Abaixo um exemplo de como utilizar RTTI em sua aplica&#231;&#227;o, este exemplo &#233; apenas uma id&#233;ia de como usar RTTI para criar classes e m&#233;todos gen&#234;ricos de acesso a base de dados.

<!--more-->

O primeiro c&#243;digo &#233; de uma classe gen&#234;rica de modelo da estrutura da tabela no banco de dados. Note que a mesma herda da classe TPersistent pois nela existe as directivas de compila&#231;&#227;o **{$M+}** (**{$METHODINFO ON}**) e **{$M-}** (**{$METHODINFO OFF}**) necess&#225;rias para implementar o acesso dos dados em mem&#243;ria.

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

O segundo c&#243;digo &#233; de uma classe de modelo da estrutura da tabela Pessoa do banco de dados, note que ela herda a classe **TModel** e que suas propridades est&#227;o declaradas na sess&#227;o **published** pois assim &#233; poss&#237;vel acessa-l&#225;s em tempo de execu&#231;&#227;o.

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

O terceiro c&#243;digo &#233; de uma classe teria os m&#233;todos de opera&#231;&#227;o na base de dados por&#233;m eu retirei pois este n&#227;o &#233; o foco deste post e sim apenas mostrar uma utiliza&#231;&#227;o do RTTI. Ent&#227;o vamos a explica&#231;&#227;o, o m&#233;todo **fillProperty** &#233; respons&#225;vel por verificar as propriedades do objeto do tipo ou que herde a classe **TModel** passado por par&#226;metro. Outro detalhe importante &#233; a declara&#231;&#227;o da unit **TypInfo** que cont&#233;m os m&#233;todos respons&#225;veis em acessar os dados em mem&#243;ria.

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

Como descrito anteriomente o m&#233;todo respons&#225;vel por acessar os dados em mem&#243;ria do objeto em tempo de execu&#231;&#227;o. Note que ap&#243;s o termino do **for** foi inserido um **ShowMessage(msg.Text);** para informar ao usu&#225;rio as propriedades e o valor das propriedades do objeto passado por par&#226;metro.

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

E por fim um trecho de c&#243;digo para voc&#234; adicionar ao evento de um **button** por exemplo de como utilizar o m&#233;todo **fillProperties** da classe **TController**.

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

Espero que gostem e seja &#250;til de alguma forma este exemplo. Em breve est&#225;rei postando uma aplica&#231;&#227;o mais real da utiliza&#231;&#227;o do RTTI para cria&#231;&#227;o de classes e m&#233;todos gen&#234;ricos de acesso a dados, lembrando que este n&#227;o &#233; a &#250;nica utiliza&#231;&#227;o do RTTI.

Desde j&#225; agrede&#231;o a visita.
