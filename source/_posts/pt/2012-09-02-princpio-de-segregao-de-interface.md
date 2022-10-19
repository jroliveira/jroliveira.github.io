---
layout: post/index
title: "Princípio de Segregação de Interface"
date: 2012-09-02
comments: true
categories: 
- dev
tags: 
- csharp
- solid
lang: pt
---

Olá pessoal, vou fazer alguns posts sobre **S.O.L.I.D.** O primeiro que gostaria de abordar com vocês é:

<pre>
  <span class="text-muted">S</span>
  <span class="text-muted">O</span>
  <span class="text-muted">L</span>
  <strong>I</strong><span class="text-default">SP - Interface Segregation Principle</span>
  <span class="text-muted">D</span>
</pre>

<!--more-->

A definição basicamente é:

> "Clients should not be forced to depend upon interfaces that they do not use."

Para mais detalhes sobre a definição, segue o link do artigo <a href="http://www.objectmentor.com/resources/articles/isp.pdf" title="The Interface Segregation Principle" target="_blank" rel="external noopener">The Interface Segregation Principle</a> que é um resumo de um capitulo do livro *"Agile Principles, Patterns, and Practices in C#"* de Martin C. Robert e Martin Micah.

Gostaria de mostrar um exemplo real onde o principio é quebrado. O exemplo está em **C#**.

O meu problema era que eu tinha uma interface onde todas as classes que precisavam fazer alguma persistência tinham que implementar, nesta interface eu tinha definido três métodos: **Save**, **Delete** e **GetBy**, porém, nem todas as classes precisavam implementar todos estes métodos.

{% codeblock IRepository.cs lang:csharp line_number:true highlight:true %}
public interface IRepository<TEnt>
    where TEnt : Entity {

    TEnt Get(int id);
    TEnt Save(TEnt entity);
    void Delete(TEnt entity);
}
{% endcodeblock %}

O próximo código mostra uma interface para definir as operações que uma ordem poderá realizar na base de dados, já que a mesma estende da interface **IRepository**.

{% codeblock IOrderRepository.cs lang:csharp line_number:true highlight:true %}
public interface IOrderRepository : IRepository<Order> { }
{% endcodeblock %}

O código abaixo é a classe que irá implementar os métodos definidos na interface **IOrderRepository** que por sua vez irá implementar os métodos definidos na interface **IRepository** já que a interface **IOrderRepository** estende da interface **IRepository**.

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

Percebem que o método **Delete** tem um **throw new NotImplementedException()**, porque eu não vou usar este método para nada, ele só está ai porque está definido na minha interface **IRepository**, e por este motivo eu sou obrigado a implementá-lo, o problema é que quando eu for utilizar a classe **OrderRepository** não tem como eu saber se o método delete tem implementação ou não e quando eu chamar o mesmo irá gerar uma exceção. Este é um exemplo que quebra o principio ISP.

Abaixo uma forma de resolver este problema. Notem que eu quebrei a interface **IRepository** em outras três interfaces:

 - **IDeleteRepository**: Que irá conter a definição do método **Delete**.
 - **IGetRepository**: Que irá conter a definição do método **GetBy**.
 - **ISaveRepository**: Que irá conter a definição do método **Save**.

A interface **IRepository** agora estende das três interfaces definidas acima, caso tenha alguma interface que precise definir as três operações, pode estender da interface **IRepository**.

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

Notem agora que a interface **IOrderRepository** não estende mais a interface **IRepository** e sim as interfaces: **IGetRepository** e **ISaveRepository**.

{% codeblock IOrderRepository.cs lang:csharp line_number:true highlight:true %}
public interface IOrderRepository
    : IGetRepository<Order>, ISaveRepository<Order>
{ }
{% endcodeblock %}

Agora a nossa classe OrderRepository não contém mais o método **Delete**.

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

Vocês podem notar que para resolver o problema do **throw new NotImplementedException()** eu tive que criar interfaces mais especificas, e a nossa classe final contém agora apenas os métodos que realmente precisa.

O código abaixo não é importante para o nosso exemplo, será mostrando apenas para completar os códigos acima.

Está é a classe base das minhas entidades. Como podem notar a interface **IRepository** pede a definição de um tipo que herde está classe.
Note que ela contém uma propriedade chamada **Id** do tipo **int**, caso você tenha a necessidade de ter em cada entidade uma propriedade Id de um tipo diferente você precisa apenas deixar genérico o tipo desta propriedade, como é apenas um exemplo não adicionei está complexidade a minha classe.


{% codeblock Entity.cs lang:csharp line_number:true highlight:true %}
public class Entity {

    public int Id { get; protected set; }
}
{% endcodeblock %}

A classe abaixo é a minha classe de **Order**, note que ela herda da classe **Entity** que foi explicada acima.

{% codeblock Order.cs lang:csharp line_number:true highlight:true %}
public class Order : Entity { }
{% endcodeblock %}

Obrigado pela visita e espero que tenha gostado, qualquer dúvida é só entrar em contato.
