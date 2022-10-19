---
layout: post/index
title: "RTTI e Class Helper no Delphi"
date: 2010-11-07
comments: true
categories: 
- dev
tags: 
- delphi
- rtti
lang: pt
---

Olá pessoal, mais um post sobre RTTI (Run-Time Type Information) no Delphi porém agora eu explorei um pouco mais das novidades do Delphi XE como as novas classes para trabalhar com RTTI e o que pode ser feito usando **Class Helper** que já vem desde as versões anteriores.

<!--more-->

Sobre RTTI não vou me fala muito pois já fiz um post sobre este assunto e **Class Helper** é um tipo que serve para extender uma classes adionando-a métodos e propriedades.

Para este exemplo vou usar o mesmo contexto do post anterior sobre RTTI para facilitar o entendimento e fazer uma comparação já que no post anterior trabalhei com a versão do Delphi 7 e neste post vou trabalhar com a versão do Delphi XE.

O primeiro código é de uma classe genêrica de modelo da estrutura da tabela no banco de dados. A primeira diferênça é que a mesma não precisa mais herdar da classe TPersistent que contém as directivas de compilação **{$M+}** (**{$METHODINFO ON}**) e **{$M-}** (**{$METHODINFO OFF}**) necessárias para implementar o acesso dos dados em memória e retirei também os métodos **Create()** e **Destroy()** pois não eram necessários.

{% codeblock TModel.pas lang:delphi line_number:true highlight:true %}
type
  TModel = class

  end;
{% endcodeblock %}

O segundo código é de uma classe de modelo da estrutura da tabela Pessoa do banco de dados, note que ela herda a classe **TModel** e a segunda diferênça é que suas propridades não precisam mais estarem declaradas na sessão **published** da classe pode ser declaradas na sessão **public** e mesmo assim é possível acessa-lás em tempo de execução. Retirei também os métodos **Create()** e **Destroy()** pois também não eram necessários.

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

O terceiro código é de uma classe que teria os métodos de operação na base de dados porém como no exemplo anterior retirei pois este não é o foco deste post e sim apenas mostrar uma utilização do RTTI e alterei a classe extendendo ela da classe **TModel**. Então vamos a explicação, o método **fillProperty** que é responsável por verificar as propriedades do objeto da classe principal **TModel** ou de uma classe que herde dela no caso **TModelPessoa**. Outro detalhe importante é a declaração da unit **Rtti** que contém os novos métodos responsáveis por acessar os dados em memória.

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

Como descrito anteriomente o método responsável por acessar os dados em memória do objeto em tempo de execução. Note que em comparação com o post anterior é necessário apenas alguns objetos para realizar está operação, note também que utilizei **for in** para percorrer a lista de propriedades em memória que é outra novidade que não existia no **Delphi 7**, no exemplo anterior tinha utilizado **for**. Ao final será imprimida na tela as propriedades e os valores das propridades do objeto principal.

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

E por fim um trecho de código para você adicionar ao evento de um **button** por exemplo de como utilizar o método **fillProperties** da classe **TController**.

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

Este foi mais um post sobre RTTI no Delphi, espero que gostem. Em breve estárei postando um exemplo de como acessar propriedades que contém objetos e não apenas tipos primitivos usando RTTI.

Agradeço a visita e volte sempre.
