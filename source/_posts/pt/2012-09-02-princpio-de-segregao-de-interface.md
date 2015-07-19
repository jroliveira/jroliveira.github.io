---
layout: post
title: Princípio de Segregação de Interface
description: Blog pessoal com assuntos dedicados a desenvolvimento de software nas linguagens de programação C Sharp, Delphi, ASP .NET, PHP e Javascript.
date: 2012-09-02 11:45
comments: true
categories: 
- desenvolvimento
- csharp
tags: 
- csharp
- solid
lang: pt
---

Ol&#225; pessoal, vou fazer alguns posts sobre **S.O.L.I.D.** O primeiro que gostaria de abordar com voc&#234;s &#233;:

<pre>
  <span class="text-muted">S</span>
  <span class="text-muted">O</span>
  <span class="text-muted">L</span>
  <strong>I</strong><span class="text-default">SP - Interface Segregation Principle</span>
  <span class="text-muted">D</span>
</pre>

A defini&#231;&#227;o basicamente &#233;:

> "Clients should not be forced to depend upon interfaces that they do not use."

<!--more-->

Para mais detalhes sobre a defini&#231;&#227;o, segue o link do artigo <a href="http://www.objectmentor.com/resources/articles/isp.pdf" title="The Interface Segregation Principle" target="_blank" rel="external noopener">The Interface Segregation Principle</a> que &#233; um resumo de um capitulo do livro *"Agile Principles, Patterns, and Practices in C#"* de Martin C. Robert e Martin Micah.

Gostaria de mostrar um exemplo real onde o principio &#233; quebrado. O exemplo est&#225; em **C#**.

O meu problema era que eu tinha uma interface onde todas as classes que precisavam fazer alguma persist&#234;ncia tinham que implementar, nesta interface eu tinha definido tr&#234;s m&#233;todos: **Save**, **Delete** e **GetBy**, por&#233;m, nem todas as classes precisavam implementar todos estes m&#233;todos.

{% codeblock IRepository.cs lang:csharp line_number:true highlight:true %}
public interface IRepository<TEnt>
    where TEnt : Entity {

    TEnt Get(int id);
    TEnt Save(TEnt entity);
    void Delete(TEnt entity);
}
{% endcodeblock %}

O pr&#243;ximo c&#243;digo mostra uma interface para definir as opera&#231;&#245;es que uma ordem poder&#225; realizar na base de dados, j&#225; que a mesma estende da interface **IRepository**.

{% codeblock IOrderRepository.cs lang:csharp line_number:true highlight:true %}
public interface IOrderRepository : IRepository<Order> { }
{% endcodeblock %}

O c&#243;digo abaixo &#233; a classe que ir&#225; implementar os m&#233;todos definidos na interface **IOrderRepository** que por sua vez ir&#225; implementar os m&#233;todos definidos na interface **IRepository** j&#225; que a interface **IOrderRepository** estende da interface **IRepository**.

{% codeblock OrderRepository.cs lang:csharp line_number:true highlight:true %}
public class OrderRepository : IOrderRepository {

    public Order Get(int id) {
        //Implementacao da busca da ordem no banco.
    }

    public Order Save(Order entity) {
        //Implementacao da insercao/atualizacao da ordem no banco.
    }

    public void Delete(Order entity) {
        //Este metodo eu nao vou utilizar porem ele esta aqui porque
        //a interface IRepository obriga que eu o implemente.
        throw new NotImplementedException();
    }
}
{% endcodeblock %}

Percebem que o m&#233;todo **Delete** tem um **throw new NotImplementedException()**, porque eu n&#227;o vou usar este m&#233;todo para nada, ele s&#243; est&#225; ai porque est&#225; definido na minha interface **IRepository**, e por este motivo eu sou obrigado a implement&#225;-lo, o problema &#233; que quando eu for utilizar a classe **OrderRepository** n&#227;o tem como eu saber se o m&#233;todo delete tem implementa&#231;&#227;o ou n&#227;o e quando eu chamar o mesmo ir&#225; gerar uma exce&#231;&#227;o. Este &#233; um exemplo que quebra o principio ISP.

Abaixo uma forma de resolver este problema. Notem que eu quebrei a interface **IRepository** em outras tr&#234;s interfaces:

 - **IDeleteRepository**: Que ir&#225; conter a defini&#231;&#227;o do m&#233;todo **Delete**.
 - **IGetRepository**: Que ir&#225; conter a defini&#231;&#227;o do m&#233;todo **GetBy**.
 - **ISaveRepository**: Que ir&#225; conter a defini&#231;&#227;o do m&#233;todo **Save**.

A interface **IRepository** agora estende das tr&#234;s interfaces definidas acima, caso tenha alguma interface que precise definir as tr&#234;s opera&#231;&#245;es, pode estender da interface **IRepository**.

{% codeblock lang:csharp line_number:true highlight:true %}
public interface IDeleteRepository<in TEnt>
    where TEnt : Entity {

    void Delete(TEnt entity);
}

public interface IGetRepository<out TEnt>
    where TEnt : Entity {

    TEnt Get(int id);
}

public interface ISaveRepository<TEnt>
    where TEnt : Entity {

    TEnt Save(TEnt entity);
}

public interface IRepository<TEnt>
    : ISaveRepository<TEnt>,
        IDeleteRepository<TEnt>,
        IGetRepository<TEnt>
    where TEnt : Entity
{ }
{% endcodeblock %}

Notem agora que a interface **IOrderRepository** n&#227;o estende mais a interface **IRepository** e sim as interfaces: **IGetRepository** e **ISaveRepository**.

{% codeblock IOrderRepository.cs lang:csharp line_number:true highlight:true %}
public interface IOrderRepository
    : IGetRepository<Order>, ISaveRepository<Order>
{ }
{% endcodeblock %}

Agora a nossa classe OrderRepository n&#227;o cont&#233;m mais o m&#233;todo **Delete**.

{% codeblock OrderRepository.cs lang:csharp line_number:true highlight:true %}
public class OrderRepository : IOrderRepository {

    public Order Get(int id) {
        //Implementacao da busca da ordem no banco.
    }

    public Order Save(Order entity) {
        //Implementacao da insercao/atualizacao da ordem no banco.
    }
}
{% endcodeblock %}

Voc&#234;s podem notar que para resolver o problema do **throw new NotImplementedException()** eu tive que criar interfaces mais especificas, e a nossa classe final cont&#233;m agora apenas os m&#233;todos que realmente precisa.

O c&#243;digo abaixo n&#227;o &#233; importante para o nosso exemplo, ser&#225; mostrando apenas para completar os c&#243;digos acima.

Est&#225; &#233; a classe base das minhas entidades. Como podem notar a interface **IRepository** pede a defini&#231;&#227;o de um tipo que herde est&#225; classe.
Note que ela cont&#233;m uma propriedade chamada **Id** do tipo **int**, caso voc&#234; tenha a necessidade de ter em cada entidade uma propriedade Id de um tipo diferente voc&#234; precisa apenas deixar gen&#233;rico o tipo desta propriedade, como &#233; apenas um exemplo n&#227;o adicionei est&#225; complexidade a minha classe.


{% codeblock Entity.cs lang:csharp line_number:true highlight:true %}
public class Entity {

    public int Id { get; protected set; }
}
{% endcodeblock %}

A classe abaixo &#233; a minha classe de **Order**, note que ela herda da classe **Entity** que foi explicada acima.

{% codeblock Order.cs lang:csharp line_number:true highlight:true %}
public class Order : Entity { }
{% endcodeblock %}

Obrigado pela visita e espero que tenha gostado, qualquer d&#250;vida &#233; s&#243; entrar em contato.
