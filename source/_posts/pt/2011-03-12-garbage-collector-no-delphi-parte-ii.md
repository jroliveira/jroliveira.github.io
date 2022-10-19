---
layout: post/index
title: "Garbage Collector no Delphi - Parte II"
date: 2011-03-12
comments: true
categories: 
- dev
tags: 
- delphi
- generics
lang: pt
---

Olá pessoal, continuando o post anterior de **Garbage Collector**, agora vou explorar o uso para objetos que herdam a classe **TObject**.

<!--more-->

Em uma thread na lista de discução **<a href="http://br.groups.yahoo.com/group/lista-delphi/" target="_blank" rel="external noopener">lista-delphi</a>** o membro **Caique** vez uma colocação perfeita do **Garbage Collector** no **Delphi** e como tinha prometido na thread vou compartilhar com vocês a explicação dele. Segue o link da **<a href="http://br.groups.yahoo.com/group/lista-delphi/message/143527" target="_blank" rel="external noopener">thread</a>**.

> O **Delphi** "não" tem **Garbage Collector**. Entende-se por **Garbage Collector** uma forma de destruir qualquer objeto fora de contexto como ocorre em plataformas gerenciadas. O que esta demonstrando no seu exemplo é o uso de interfaces e estas sim por definição destroem o objeto a qual estão associadas quando saem do contexto.

Primeiro desenvolvi uma classe que será responsável por coletar os objetos que não estão mais sendo utilizados.

{% codeblock TSafeGuard.pas lang:delphi line_number:true highlight:true %}
unit GarbageCollector;

interface

uses
  SysUtils;

type
  ISafeGuard = type IUnknown;

type
  TSafeGuard = class(TInterfacedObject, ISafeGuard)
  private
    { Private declarations }
    FObj: TObject;

  public
    { Public declarations }
    constructor Create(obj: TObject);
    destructor Destroy(); override;

  end;

function Guard(out SafeGuard : ISafeGuard) : TObject;

implementation

{ TSafeGuard }

constructor TSafeGuard.Create(obj: TObject);
begin
  self.FObj := obj;
end;

destructor TSafeGuard.Destroy();
begin
  if (Assigned(self.FObj)) then
  begin
    try
      FreeAndNil(self.FObj);
    except
      on e : EInvalidPointer do
        { Objeto ja liberado da memoria. }
    end;
  end;

  inherited Destroy();
end;

function Guard(out SafeGuard: ISafeGuard): TObject;
begin
  Result := TObject.Create();
  SafeGuard := TSafeGuard.Create(Result);
end;

end.
{% endcodeblock %}

Depois criei um **Class Helper** para a classe **TObject** do **Delphi** com isto garantimos que todos os objetos que herdam a classe **TObject** serão coletados pelo nosso **Garbage Collector**. Note que estou utilizando **Generics** para a nossa função **New()** já realizar o cast no objeto sem agente precisar se preocupar com isto.

{% codeblock THelperObject.pas lang:delphi line_number:true highlight:true %}
unit HelperObject;

interface

uses
  SysUtils, Generics.Collections, GarbageCollector;

type
  THelperObject = class helper for TObject
  public
    { Public declarations }
    class function New<T>(out SafeGuard: ISafeGuard): T; static;

  end;

implementation

{ THelperObject }

class function THelperObject.New<T>(out SafeGuard: ISafeGuard): T;
begin
  Result := T(Guard(SafeGuard));
end;

end.
{% endcodeblock %}

Agora a forma de utilização.

{% codeblock lang:delphi line_number:true highlight:true %}
var
  SafeGuard: ISafeGuard;
  label1: TLabel;

begin
  label1 := TLabel.New<TLabel>(SafeGuard);
end;
{% endcodeblock %}

Para garantir que a memória está sendo liberada, utilize a mesma propriedade do post anterior **[Garbage Collector no Delphi - Parte I][post-i]**, neste post está explicado detalhadamento como deve ser utilizada.

{% codeblock lang:delphi line_number:true highlight:true %}
ReportMemoryLeaksOnShutdown := True;
{% endcodeblock %}

Este foi mais um exemplo em **Delphi XE**. Espero que tenham gostado e que seja útil de alguma forma a vocês.

[post-i]: /garbage-collector-no-delphi-parte-i/
