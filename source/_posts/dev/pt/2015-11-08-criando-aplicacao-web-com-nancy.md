---
layout: post/index
title: "Criando aplicação web com Nancy"
description: "Post sobre Nancy, o que é, como funciona, quais as vantagens como instalar, como usar e uns exemplos iniciais."
date: 2015-11-08
comments: true
categories:
- dev
tags:
- csharp
- nancy
lang: pt
---

Olá pessoal, hoje eu vou falar um pouco sobre <a href="http://nancyfx.org/" target="_blank" rel="external noopener">Nancy</a>.

<!--more-->

**O que é?**

É um framework leve e simples para construção serviços **HTTP** usando tecnologia **.Net** e **Mono**, e fornece uma **Domain Specific Language (DSL)** para devolver uma resposta de forma simples.  
Foi projetada para rodar em qualquer lugar, já que ela possui seus próprios objetos de solicitação e resposta.  
Um dos conceitos fundamentais em Nancy são os hosts. Um host atua como um adaptador para um ambiente de hospedagem, permitindo assim que ela possa ser executada com as tecnologias existentes, como **ASP.NET**, **WCF** e **Owin**, ou integrado em qualquer aplicação.  
Nancy é um projeto open source, hospedado no GitHub e está licenciado sob a **MIT license**.

**Como instalar?**

Você pode instalar via NuGet, segue a <a href="https://www.nuget.org/profiles/nancyfx" target="_blank" rel="external noopener">lista dos pacotes</a> oficiais da Nancy.  
Se você vai usar sobre ASP.NET por exemplo, você pode executar o comando abaixo no **Package Manager Console** do Visual Studio.

```
Install-Package Nancy.Hosting.Aspnet
```

**Qual problema resolve?**

 - Não precisa de muitas configurações, ela já vem com algumas definidas.  
 - Para adicionar um novo módulo, geralmente é só implementar uma interface e ela já injeta para você via reflection.  
 - Existem muitos módulos separados já criados, por exemplo, para trocar o IoC padrão é só instalar o novo e configurar no Boostrapper.  

Com Nancy você precisa se preocupar mais em criar seu aplicativo do que ficar criando código de configuração.

**Alguns exemplos**

Agora vamos criar nosso primeiro exemplo.  
No Visual Studio na tela de **New Project**, escolha a versão **.NET Framework 4.5**, depois crie um projeto **ASP.NET Empty Web Application**.  
No **Package Manager Console**, rode o comando **Install-Package Nancy.Hosting.Aspnet**.  
Agora crie uma classe com o código abaixo.  

{% codeblock HomeModule.cs lang:csharp line_number:true highlight:true %}
public class HomeModule : NancyModule
{
    public HomeModule()
    {
        Get["/"] = _ => "I'm working...";
    }
}
{% endcodeblock %}

Agora se você rodar a aplicação irá imprimir no navegador.

```
I'm working...
```

Para receber uma informação passada na **Query String** é bem simples segue um exemplo abaixo.  

{% codeblock AccountsModule.cs lang:csharp line_number:true highlight:true %}
public class AccountsModule : NancyModule
{
    public AccountsModule()
        : base("accounts")
    {
        Get["/{id}"] = parameters => GetById(parameters.id);
    }

    private Response GetById(int id)
    {
        var response = new
        {
            id,
            name = "Júnior"
        };

        return Response.AsJson(response);
    }
}
{% endcodeblock %}

Se você for ao navegador e digitar **/accounts/25** ele irá imprimir o json abaixo.

{% codeblock lang:js line_number:true highlight:true %}
{
    id: 25,
    name: "Júnior"
}
{% endcodeblock %}

Recebendo os dados de uma requisição **POST**.  
Note no código que eu usei o código **this.Bind()** para fazer o de para dos dados enviados para a minha classe **AccountModel**.  
Depois eu apenas gerei um Id randômico e respondi o id fake gerado.

{% codeblock AccountsModule.cs lang:csharp line_number:true highlight:true %}
public class AccountsModule : NancyModule
{
    public AccountsModule()
        : base("accounts")
    {
        Get["/{id}"] = parameters => GetById(parameters.id);
        Post["/"] = _ => Create(this.Bind<AccountModel>());
    }

    private Response GetById(int id)
    {
        var response = new
        {
            id,
            name = "Júnior"
        };

        return Response.AsJson(response);
    }

    private Response Create(AccountModel model)
    {
        model.Id = new Random().Next(1, 100);

        var response = new
        {
            id = model.Id
        };

        return Response.AsJson(response, HttpStatusCode.Created);
    }
}

public class AccountModel
{
    public int Id { get; set; }
}
{% endcodeblock %}

Devolvendo uma página HTML.  
Para devolver uma página HTML, você precisa criar na raiz do projeto uma pasta chamada **Views**, e dentro dela, uma pasta com o nome igual a da sua rota.  
No caso eu vou criar um módulo chamado **DocModule** e uma rota para **doc**, logo dentro da pasta **Views** eu vou criar uma pasta **Doc** e colocar o meu arquivo HTML lá dentro.  
Abaixo o código para devolver o arquivo HTML para o navegador, note que o nome do arquivo que eu estou devolvendo é **index.html**, sendo assim, o nome do arquivo que eu vou criar precisa ser **index.html** também.

{% codeblock DocModules.cs lang:csharp line_number:true highlight:true %}
public class DocModules : NancyModule
{
    public DocModules()
        : base("doc")
    {
        Get["/"] = _ => View["index.html"];
    }
}
{% endcodeblock %}

Obrigado pela visita e até a próxima.
