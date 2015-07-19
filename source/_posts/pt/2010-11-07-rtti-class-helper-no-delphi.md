---
layout: post
title: RTTI e Class Helper no Delphi
description: Blog pessoal com assuntos dedicados a desenvolvimento de software nas linguagens de programação C Sharp, Delphi, ASP .NET, PHP e Javascript.
date: 2010-11-07 13:59
comments: true
categories: 
- desenvolvimento
- delphi
tags: 
- delphi
- rtti
lang: pt
---

Ol&#225; pessoal, mais um post sobre RTTI (Run-Time Type Information) no Delphi por&#233;m agora eu explorei um pouco mais das novidades do Delphi XE como as novas classes para trabalhar com RTTI e o que pode ser feito usando **Class Helper** que j&#225; vem desde as vers&#245;es anteriores.

Sobre RTTI n&#227;o vou me fala muito pois j&#225; fiz um post sobre este assunto e **Class Helper** &#233; um tipo que serve para extender uma classes adionando-a m&#233;todos e propriedades.

Para este exemplo vou usar o mesmo contexto do post anterior sobre RTTI para facilitar o entendimento e fazer uma compara&#231;&#227;o j&#225; que no post anterior trabalhei com a vers&#227;o do Delphi 7 e neste post vou trabalhar com a vers&#227;o do Delphi XE.

<!--more-->

O primeiro c&#243;digo &#233; de uma classe gen&#234;rica de modelo da estrutura da tabela no banco de dados. A primeira difer&#234;n&#231;a &#233; que a mesma n&#227;o precisa mais herdar da classe TPersistent que cont&#233;m as directivas de compila&#231;&#227;o **{$M+}** (**{$METHODINFO ON}**) e **{$M-}** (**{$METHODINFO OFF}**) necess&#225;rias para implementar o acesso dos dados em mem&#243;ria e retirei tamb&#233;m os m&#233;todos **Create()** e **Destroy()** pois n&#227;o eram necess&#225;rios.

{% codeblock TModel.pas lang:delphi line_number:true highlight:true %}
type
  TModel = class

  end;
{% endcodeblock %}

O segundo c&#243;digo &#233; de uma classe de modelo da estrutura da tabela Pessoa do banco de dados, note que ela herda a classe **TModel** e a segunda difer&#234;n&#231;a &#233; que suas propridades n&#227;o precisam mais estarem declaradas na sess&#227;o **published** da classe pode ser declaradas na sess&#227;o **public** e mesmo assim &#233; poss&#237;vel acessa-l&#225;s em tempo de execu&#231;&#227;o. Retirei tamb&#233;m os m&#233;todos **Create()** e **Destroy()** pois tamb&#233;m n&#227;o eram necess&#225;rios.

{% codeblock TModelPessoa.pas lang:delphi line_number:true highlight:true %}
uses
  Model;

type
  TModelPessoa = class(TModel)
  private
    { Private declarations }
    FPessIden: Integer;
    FPessNome: String;

  public
    { Public declarations }
    property PessIden: Integer read FPessIden write FPessIden;
    property PessNome: String read FPessNome write FPessNome;

  end;
{% endcodeblock %}

O terceiro c&#243;digo &#233; de uma classe que teria os m&#233;todos de opera&#231;&#227;o na base de dados por&#233;m como no exemplo anterior retirei pois este n&#227;o &#233; o foco deste post e sim apenas mostrar uma utiliza&#231;&#227;o do RTTI e alterei a classe extendendo ela da classe **TModel**. Ent&#227;o vamos a explica&#231;&#227;o, o m&#233;todo **fillProperty** que &#233; respons&#225;vel por verificar as propriedades do objeto da classe principal **TModel** ou de uma classe que herde dela no caso **TModelPessoa**. Outro detalhe importante &#233; a declara&#231;&#227;o da unit **Rtti** que cont&#233;m os novos m&#233;todos respons&#225;veis por acessar os dados em mem&#243;ria.

{% codeblock TController.pas lang:delphi line_number:true highlight:true %}
uses
  TypInfo, Rtti, Classes, Dialogs, Model, Variants, SysUtils;

type
  TController = class helper for TModel
  public
    { Public declarations }
    procedure fillProperties();

  end;
{% endcodeblock %}

Como descrito anteriomente o m&#233;todo respons&#225;vel por acessar os dados em mem&#243;ria do objeto em tempo de execu&#231;&#227;o. Note que em compara&#231;&#227;o com o post anterior &#233; necess&#225;rio apenas alguns objetos para realizar est&#225; opera&#231;&#227;o, note tamb&#233;m que utilizei **for in** para percorrer a lista de propriedades em mem&#243;ria que &#233; outra novidade que n&#227;o existia no **Delphi 7**, no exemplo anterior tinha utilizado **for**. Ao final ser&#225; imprimida na tela as propriedades e os valores das propridades do objeto principal.

{% codeblock TController.pas lang:delphi line_number:true highlight:true %}
procedure TController.fillProperties();
var
  msg: TStringList;
  context: TRttiContext;
  prop: TRttiProperty;

begin
  context := TRttiContext.Create();
  try
    msg:= TStringList.Create();

    for prop in context.GetType(self.ClassType).GetProperties do
      msg.Add(Format('%s: %s;', [prop.Name, VarToStr(prop.GetValue(self).AsVariant)]));

    ShowMessage(msg.Text);
  finally
    context.Free();
  end;
end;
{% endcodeblock %}

E por fim um trecho de c&#243;digo para voc&#234; adicionar ao evento de um **button** por exemplo de como utilizar o m&#233;todo **fillProperties** da classe **TController**.

{% codeblock TController.pas lang:delphi line_number:true highlight:true %}
var
  objPessoa: TModelPessoa;

begin
  try
    objPessoa := TModelPessoa.Create();
    objPessoa.PessIden := 23;
    objPessoa.PessNome := 'Oliveira';
    objPessoa.fillProperties();
  finally
    FreeAndNil(objPessoa);
  end;
end;
{% endcodeblock %}

Este foi mais um post sobre RTTI no Delphi, espero que gostem. Em breve est&#225;rei postando um exemplo de como acessar propriedades que cont&#233;m objetos e n&#227;o apenas tipos primitivos usando RTTI.

Agrade&#231;o a visita e volte sempre.
