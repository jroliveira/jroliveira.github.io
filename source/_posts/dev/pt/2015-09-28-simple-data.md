---
layout: post/index
title: "Simple.Data"
description: "Post sobre Simple.Data, o que é, como funciona, quais bancos de dados ele suporta e como faz para realizar as operações nos bancos de dados."
date: 2015-09-28
comments: true
categories:
- dev
tags:
- csharp
- simpledata
lang: pt
---

Olá pessoal, hoje eu vou falar um pouco sobre <a href="https://github.com/markrendle/Simple.Data" target="_blank" rel="external noopener">Simple.Data</a>.

<!--more-->

**O que é?**

Simple.Data é um micro framework de acesso a banco de dados baseado no **ActiveRecord** e **DataMapper** do **Ruby**.  
Ele usa **dynamic** do **.NET 4** para interpretar nomes de método e propriedade em tempo de execução e mapeá-los usando uma abordagem baseada em convenções.

**Como instalar?**

Você pode instalar via NuGet, segue a <a href="https://www.nuget.org/profiles/markrendle?showAllPackages=True" target="_blank" rel="external noopener">lista dos pacotes</a> oficiais do Simple.Data.  
Se você vai usar no **SQL Server** por exemplo, você pode executar o comando abaixo no **Package Manager Console** do Visual Studio.

```
Install-Package Simple.Data.SqlServer
```

**Qual problema resolve?**

Não precisa de muitas linhas de códigos para acessar o banco de dados.  
Não precisa se preocupar com **SQL injection**.  
É uma forma **fluente** de escrever as operação que serão feitas no banco de dados.  
Diferente dos **ORM's** como [NHibernate][nhibernate], não precisa configurar o mapeamento de tabela para classe.

**Alguns exemplos**

<a href="http://simplefx.org/simpledata/docs/pages/Modify/AddingData.html" target="_blank" rel="external noopener">Insert</a>, existem várias formas de inserir um dado usando Simple.Data, abaixo apenas uma das possíveis formas, este exemplo completo está no <a href="https://github.com/jroliveira/url-shortener/blob/master/src/UrlShortener.WebApi/Infrastructure/Data/Commands/Account/CreateCommand.cs" target="_blank" rel="external noopener">GitHub</a>.

{% codeblock lang:csharp line_number:true highlight:true %}
var db = Database.OpenNamedConnection("db");

var account = new Account
{
    Name = "Junior",
    Email = "junior@email.com",
    Password = "123456"
};

db.Accounts.Insert(account);
{% endcodeblock %}

<a href="http://simplefx.org/simpledata/docs/pages/Modify/UpdatingData.html" target="_blank" rel="external noopener">Update</a>, existem várias formas de atualizar um dado usando Simple.Data, abaixo apenas uma das possíveis formas, este exemplo completo está no <a href="https://github.com/jroliveira/url-shortener/blob/master/src/UrlShortener.WebApi/Infrastructure/Data/Commands/Account/UpdateCommand.cs" target="_blank" rel="external noopener">GitHub</a>.

{% codeblock lang:csharp line_number:true highlight:true %}
var db = Database.OpenNamedConnection("db");

Account account = db.Accounts.Get(id);

account.Name = "Junior Oliveira";

db.Accounts.Update(account);
{% endcodeblock %}

<a href="http://simplefx.org/simpledata/docs/pages/Modify/DeletingData.html" target="_blank" rel="external noopener">Delete</a>, existem várias formas de deletar um dado usando Simple.Data, abaixo apenas uma das possíveis formas.

{% codeblock lang:csharp line_number:true highlight:true %}
var db = Database.OpenNamedConnection("db");

db.Accounts.DeleteById(id);
{% endcodeblock %}

Abaixo alguns exemplos mais complexos do que se consegue fazer com Simple.Data.   
Exemplo usando <a href="http://simplefx.org/simpledata/docs/pages/Retrieve/Commands/All.html" target="_blank" rel="external noopener">All</a>, <a href="http://simplefx.org/simpledata/docs/pages/Retrieve/ColumnSelection.html" target="_blank" rel="external noopener">Select</a>, <a href="http://simplefx.org/simpledata/docs/pages/Retrieve/WhereClauses.html" target="_blank" rel="external noopener">Where</a>, Skip, Take e <a href="http://simplefx.org/simpledata/docs/pages/Retrieve/OrderingResults.html" target="_blank" rel="external noopener">OrderBy</a>, este exemplo completo está no <a href="https://github.com/jroliveira/url-shortener/blob/master/src/UrlShortener.WebApi/Infrastructure/Data/Queries/Account/GetAll.cs" target="_blank" rel="external noopener">GitHub</a>.

{% codeblock lang:csharp line_number:true highlight:true %}
var db = Database.OpenNamedConnection("db");

List<Account> model = db.Accounts.All()
                                 .Select(
                                     db.Accounts.Id,
                                     db.Accounts.Name,
                                     db.Accounts.Email)
                                 .Skip(_skip.Apply(filter))
                                 .Take(_limit.Apply(filter))
                                 .OrderBy(
                                     db.Accounts.Name);
{% endcodeblock %}

Outro exemplo usando <a href="http://simplefx.org/simpledata/docs/pages/Retrieve/LazyLoadingJoins.htm" target="_blank" rel="external noopener">Join ~ On</a>, <a href="http://simplefx.org/simpledata/docs/pages/Retrieve/ColumnAliasing.html" target="_blank" rel="external noopener">As</a>, e FirstOrDefault, este exemplo completo está no <a href="https://github.com/jroliveira/url-shortener/blob/master/src/UrlShortener.WebApi/Infrastructure/Data/Queries/Url/GetByShortened.cs" target="_blank" rel="external noopener">GitHub</a>.

{% codeblock lang:csharp line_number:true highlight:true %}
dynamic accounts;

var data = db.Urls.All()
                  .Join(db.Accounts, out accounts)
                      .On(db.Urls.AccountId == accounts.Id)
                  .Select(
                      db.Urls.Id,
                      db.Urls.Address,
                      accounts.Id.As("AccountId"))
                  .Where(
                      db.Urls.Shortened == shortened)
                  .FirstOrDefault();
{% endcodeblock %}

Em Simple.Data existem várias formas de fazer uma coisa, segue o site da <a href="http://simplefx.org/simpledata/docs/" target="_blank" rel="external noopener">documentação completa</a>, você pode utilizar a que você achar melhor.  
Notem que quando eu declaro `List<Account> model = ...`, o Simple.Data já faz o cast automático para o tipo que eu estou declarando, mas as propriedades e as colunas precisam ter o mesmo nome.  
No Simple.Data eu não posso utilizar interface para fazer o cast por exemplo **IList** ao invés de **List**.

**Configurando Log de SQL**

No Simple.Data, é possível configurar para ele mostrar o SQL gerado no Output do Visual Studio.  
É só adicionar as linhas abaixo no **Web.config** de sua aplicação web por exemplo, o exemplo completo está no <a href="https://github.com/jroliveira/url-shortener/blob/master/src/UrlShortener.WebApi/Web.config" target="_blank" rel="external noopener">GitHub</a>

{% codeblock Web.config lang:xml line_number:true highlight:true %}
<system.diagnostics>
  <switches>
    <add name="Simple.Data" value="Information" />
  </switches>
</system.diagnostics>
{% endcodeblock %}

**Suporte a vários bancos de dados SQL e NoSQL**

Simple.Data consegue fornecer suporte a vários bancos de dados por causa de sua linguagem própria para realizar as operação no banco de dados.

Atualmente, ele dá suporte para:

 - Acesso baseado em ADO para bancos de dados relacionais:
  - SQL Server 2005 e versões posterior (incluindo SQL Azure)
  - SQL servidor Compact Edition 4.0
  - Oracle
  - MySQL 4.0 e posterior
  - SQLite
  - PostgreSQL
  - SQLAnywhere
  - Informix
 - MongoDB
 - OData

O suporte a Azure Table Storage está em desenvolvimento. Simple.Data também suporta Mono na versão 1.0.

Obrigado pela visita e até a próxima.
