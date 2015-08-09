---
layout: post
title: NHibernate
description: Blog pessoal com assuntos dedicados a desenvolvimento de software nas linguagens de programação C Sharp, Delphi, ASP .NET, PHP e Javascript.
date: 2014-06-25 09:46
comments: true
categories:
- desenvolvimento
- csharp
tags:
- csharp
- nhibernate
- singleton
lang: pt
---

Ol&#225; pessoal, depois de um tempo parado, vamos falar um pouco de **NHibernate**.
Este post estava pronto a bastante tempo pode ser que alguma coisa n&#227;o seja mais aplicado nas novas vers&#227;o do NHibernate.

**Instalando**

A forma mais simples de instalar o NHibernate &#233; usando o <a href="http://nuget.org/" target="_blank" rel="external noopener">NuGet</a>, abaixo o comando para instalar o NHibernate. No exemplo estou usando a vers&#227;o **3.3.3.4000** para o **.NET Framework 4.0**.

<!--more-->

```
install-package NHibernate
```

**Configurando**

Adicione um arquivo XML na solu&#231;&#227;o chamado **hibernate.cfg.xml**.
Este arquivo ir&#225; conter as especifica&#231;&#245;es de conex&#227;o a base de dados e outras configura&#231;&#245;es da conex&#227;o.
Abaixo segue uma configura&#231;&#227;o padr&#227;o para o banco **MySQL** e uma aplica&#231;&#227;o Web:

{% codeblock hibernate.cfg.xml lang:xml line_number:true highlight:true %}
<?xml version='1.0' encoding='utf-8'?>
<hibernate-configuration xmlns="urn:nhibernate-configuration-2.2">

  <session-factory>
    <property name="connection.provider">
      NHibernate.Connection.DriverConnectionProvider, NHibernate
    </property>
    <property name="connection.connection_string_name">
      ConnectionString
    </property>
    <property name="dialect">
      NHibernate.Dialect.MySQLDialect
    </property>
    <property name="current_session_context_class">
      web
    </property>
  </session-factory>  

</hibernate-configuration>
{% endcodeblock %}

Link com a lista de <a href="http://nhforge.org/doc/nh/en/#configuration-optional" target="_blank" rel="external noopener">propriedades de configuração</a> do NHibernate.

**Dom&#237;nio**

O dom&#237;nio abaixo &#233; uma representa&#231;&#227;o de uma conta de jogador, retirada do projeto <a href="https://github.com/junioro/dolrath" target="_blank" rel="external noopener">Dolrath</a> e adaptada para ficar mais did&#225;tica.

{% codeblock Account.cs lang:csharp line_number:true highlight:true %}
public class Account : Entity<int> {

    public virtual string Email { get; protected set; }
    public virtual string Password { get; protected set; }
    public virtual string Name { get; set; }
    public virtual string Surname { get; set; }

    protected Account() { }

    public Account(string email, string password) {
        Email = email;
        Password = password;
    }

    public virtual void NewPassword() {
        Password = Guid.NewGuid().ToString().Substring(0, 5);
    }
}
{% endcodeblock %}

Alguns pontos importantes ao notar o dom&#237;nio &#233; a presen&#231;a do modificador **virtual** nos m&#233;todos e propriedades, este modificador possibilita o NHibernate criar um proxy sobre a nossa classe e que n&#227;o existe nenhuma presen&#231;a de infraestrutura de acesso a dados.

**Mapeamento**

O mapeamento abaixo esta escrito em XML, existem outras formas de mapeamento como por exemplo atributos ou por c&#243;digo usando <a href="http://www.fluentnhibernate.org/" target="_blank" rel="external noopener">NHibernate Fluent</a>. Uma vantagens que eu vejo ao usar XML &#233; que voc&#234; n&#227;o precisa recompilar a aplica&#231;&#227;o para alterar alguma regra no mapeamento e a forma de utiliza&#231;&#227;o ao meu ver &#233; mais simples e did&#225;tica.

Abaixo esta o mapeamento da nossa classe de dom&#237;nio acima.

{% codeblock lang:xml line_number:true highlight:true %}
<?xml version="1.0" encoding="utf-8" ?>
<hibernate-mapping xmlns="urn:nhibernate-mapping-2.2"
                   assembly="Dolrath"
                   namespace="Dolrath.Domain.Entities">

  <class name="Account" table="Accounts">
    <id name="Id" type="Int32">
      <generator class="hilo"/>
    </id>

    <property name="Email" type="string" length="100" not-null="true" />
    <property name="Password" type="string" length="100" not-null="true" />
    <property name="Name" type="string" length="100" not-null="false" />
    <property name="Surname" type="string" length="100" not-null="false" />

  </class>
</hibernate-mapping>
{% endcodeblock %}

Uma das configura&#231;&#245;es mais importantes deste mapeamento &#233; o gerador da chave prim&#225;ria, neste exemplo estou usando **hilo**, ele &#233; usado para gerar a chave sem precisar ir at&#233; a base de dados n&#227;o quebramos a <a href="http://martinfowler.com/eaaCatalog/unitOfWork.html" target="_blank" rel="external noopener">Unit Of Work</a>.

Click no elemento abaixo para maiores detalhes de seus atributos.

<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-mapping" target="_blank" rel="external noopener">hibernate-mapping</a>
<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-class" target="_blank" rel="external noopener">class</a>
<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-id" target="_blank" rel="external noopener">id</a>
<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-property" target="_blank" rel="external noopener">property</a>

**Rela&#231;&#245;es**

Abaixo as duas formas de fazer uma rela&#231;&#227;o de **N para N** (<a href="http://nhforge.org/doc/nh/en/#collections-ofvalues" target="_blank" rel="external noopener">many-to-many</a>).

**bag**: &#201; usado quando temos uma situa&#231;&#227;o onde a cole&#231;&#227;o pode haver valores duplicados.

{% codeblock lang:xml line_number:true highlight:true %}
<class name="Order" table="tbOrder">
  <id name="Id" column="OrderId">
    <generator class="identity"/>
  </id>

  <bag name="Items" inverse="true" cascade="all" access="field.camelcase-underscore">
    <key column="OrderId" />
    <one-to-many class="OrderItem" />
  </bag>    

</class>
{% endcodeblock %}

**set**: &#201; usado quando temos uma situa&#231;&#227;o onde a cole&#231;&#227;o n&#227;o pode haver valores duplicados.

{% codeblock lang:xml line_number:true highlight:true %}
<class name="Character" table="Characters">
  <id name="Id" type="Int32">
    <generator class="hilo"/>
  </id>

  <set name="Inventory" lazy="true" access="field.camelcase-underscore">
    <key column="CharacterId"/>
    <many-to-many class="Item" column="ItemId" />
  </set>

</class>
{% endcodeblock %}

Rela&#231;&#227;o de **N para 1** (<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-manytoone" target="_blank" rel="external noopener">many-to-one</a>).

{% codeblock lang:xml line_number:true highlight:true %}
<class name="Character" table="Characters">
  <id name="Id" type="Int32">
    <generator class="hilo"/>
  </id>

  <many-to-one name="Account" unique="true" column="AccountId" />
</class>
{% endcodeblock %}

Rela&#231;&#227;o de **1 para 1** (<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-onetoone" target="_blank" rel="external noopener">one-to-one</a>).

{% codeblock lang:xml line_number:true highlight:true %}
<class name="Account" table="Accounts">
  <id name="Id" type="Int32">
    <generator class="hilo"/>
  </id>

  <one-to-one name="Character" class="Character" cascade="all" />
</class>
{% endcodeblock %}

**Outras configura&#231;&#245;es**

<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-discriminator" target="_blank" rel="external noopener">Discriminator</a>

{% codeblock lang:xml line_number:true highlight:true %}
<class name="Character" table="Characters">
  <id name="Id" type="Int32">
    <generator class="hilo"/>
  </id>

  <discriminator column="Discriminator" not-null="true"	type="string" />

  <subclass name="Humano" discriminator-value="Humano"></subclass>
  <subclass name="Elf" discriminator-value="Elf"></subclass>
  <subclass name="Draconiano" discriminator-value="Draconiano"></subclass>
  <subclass name="Metamorfo" discriminator-value="Metamorfo"></subclass>

</class>
{% endcodeblock %}

**Session Factory**

A **Session Factory** &#233; respons&#225;vel por construir as sess&#245;es.
Quando uma aplica&#231;&#227;o &#233; iniciada deve-se carregar todas as configura&#231;&#245;es do NHibernate e mapeamentos para criar a Session Factory, a cria&#231;&#227;o da Session Factory &#233; um processo demorado e deve ser feito apenas uma vez na aplica&#231;&#227;o.
O c&#243;digo abaixo &#233; uma implementa&#231;&#227;o do padr&#227;o <a href="http://www.dofactory.com/Patterns/PatternSingleton.aspx" target="_blank" rel="external noopener">Singleton</a> e garante que a Session Factory ser&#225; criada apenas uma vez na aplica&#231;&#227;o.

{% codeblock SessionFactoryFactory.cs lang:csharp line_number:true highlight:true %}
public sealed class SessionFactoryFactory {

    private readonly ISessionFactory _sessionFactory;
    public ISessionFactory CurrentSessionFactory { get { return _sessionFactory; } }

    private static volatile SessionFactoryFactory _instance;
    private static readonly object SyncRoot = new Object();

    private SessionFactoryFactory() {
        var cfg = new Configuration();
        cfg.Configure();
        cfg.AddAssembly(typeof(SessionFactoryFactory).Assembly);

        _sessionFactory = cfg.BuildSessionFactory();
    }

    public static SessionFactoryFactory Instance {
        get {
            if (_instance == null) {
                lock (SyncRoot) {
                    if (_instance == null)
                        _instance = new SessionFactoryFactory();
                }
            }

            return _instance;
        }
    }
}
{% endcodeblock %}

**Action Filter - Transaction Per Request**

Exitem v&#225;rias formas de criar uma **session** em uma aplica&#231;&#227;o web a forma que irei adotar &#233; bem comum, ela cria uma session por cada requisi&#231;&#227;o feita.

Simplesmente vamos criar um **action filter** que ir&#225; interceptar a "entrada" e a "sa&#237;da" da nossa **action** da **controller**.

Na entrada vamos pegar a session usando o **cont&#234;iner de depend&#234;ncia** e iniciar uma transa&#231;&#227;o setando o **n&#237;vel de isolamento** da mesma.
Lista dos <a href="http://msdn.microsoft.com/pt-br/library/system.data.isolationlevel.aspx" target="_blank" rel="external noopener">níveis de isolamentos</a>.

Na sa&#237;da vamos verificar se houve um erro na requisi&#231;&#227;o. Caso n&#227;o houve um erro a transa&#231;&#227;o ser&#225; feito um **commit** da transa&#231;&#227;o, sen&#227;o ser&#225; feito um **rollback** na mesma.

No final a Session ser&#225; destru&#237;da.

{% codeblock TransactionPerRequestAttribute.cs lang:csharp line_number:true highlight:true %}
[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
public class TransactionPerRequestAttribute : ActionFilterAttribute {

    private readonly IsolationLevel _isolationLevel;
    private ISession _session;
    private ITransaction _transaction;

    public TransactionPerRequestAttribute(IsolationLevel isolationLevel = IsolationLevel.ReadUncommitted) {
        _isolationLevel = isolationLevel;
    }

    public override void OnActionExecuting(ActionExecutingContext filterContext) {
        _session = IoCContainer.Get<ISession>();
        _transaction = _session.BeginTransaction(_isolationLevel);
    }

    public override void OnActionExecuted(ActionExecutedContext filterContext) {
        if (filterContext.Exception == null)
            _transaction.Commit();
        else
            _transaction.Rollback();
    }
}
{% endcodeblock %}

**Action Filter - NHibernate Session**

Este **actino filter** ser&#225; utilizado para poder acoplar e desacoplar a session do NHibernate no contexto atual, para ficar mais simples a utiliza&#231;&#227;o vamos registrar ele no **global filter** assim n&#227;o precisamos decorar a nossa action com esta anota&#231;&#227;o.

{% codeblock FilterConfig.cs lang:csharp line_number:true highlight:true %}
public class FilterConfig {

    public static void RegisterGlobalFilters(GlobalFilterCollection filters) {
        filters.Add(new HandleErrorAttribute());
        filters.Add(new NHibernateSessionAttribute());
    }
}

[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
public class NHibernateSessionAttribute : ActionFilterAttribute {

    public override void OnActionExecuting(ActionExecutingContext filterContext) {
        if (!CurrentSessionContext.HasBind(SessionFactoryFactory.Instance.CurrentSessionFactory)) {
            CurrentSessionContext.Bind(IoCContainer.Get<ISession>());
        }
    }

    public override void OnActionExecuted(ActionExecutedContext filterContext) {
        var currentSession = CurrentSessionContext.Unbind(SessionFactoryFactory.Instance.CurrentSessionFactory);
        if (currentSession == null) return;
        currentSession.Close();
        currentSession.Dispose();
    }
}
{% endcodeblock %}

**Controller**

Notem que estou recebendo a session no construtor da controller, quem ir&#225; fornecer esta session ser&#225; o cont&#234;iner de depend&#234;ncia.
A **action create** do m&#233;todo **post** esta decorada com a anota&#231;&#227;o **TransactionPerRequest**, isto indica que esta action ter&#225; um controle de transa&#231;&#227;o.

{% codeblock AccountController.cs lang:csharp line_number:true highlight:true %}
public class AccountController : BaseController {

    private readonly ISession _session;

    public AccountController(ISession session) {
        _session = session;
    }

    [HttpGet]
    public ActionResult Create() {
        return View();
    }

    [HttpPost]
    [TransactionPerRequest]
    public ActionResult Create(CreateViewModel viewModel) {
        if (!ModelState.IsValid) return Error("Existem campos para preencher.", View(viewModel));

        var account = new Account(viewModel.Email, viewModel.Password);
        _session.Save(account);

        return Information("Sua conta foi criada com sucesso.", RedirectToAction("Index", "Home"));
    }
}
{% endcodeblock %}

Existem v&#225;rias formas de buscar dados usando NHibernate segue alguns abaixo:

<a href="http://nhforge.org/doc/nh/en/#querycriteria" target="_blank" rel="external noopener">Criteria Queries</a>

{% codeblock AccountGetByIdQuery.cs lang:csharp line_number:true highlight:true %}
public class AccountGetByIdQuery : IQuery<Account> {

    private readonly ISession _session;

    public int Id { get; set; }

    public AccountGetByIdQuery(ISession session) {
        _session = session;
    }

    public Account GetResult() {
        return _session.CreateCriteria<Account>()
                        .Add(Restrictions.Eq("Id", Id))
                        .UniqueResult<Account>();
    }
}
{% endcodeblock %}

<a href="http://nhforge.org/doc/nh/en/#queryqueryover" target="_blank" rel="external noopener">QueryOver Queries</a>

{% codeblock AccountGetByEmailQuery.cs lang:csharp line_number:true highlight:true %}
public class AccountGetByEmailQuery : IQuery<Account> {

    private readonly ISession _session;

    public string Email { get; set; }

    public AccountGetByEmailQuery(ISession session) {
        _session = session;
    }

    public virtual Account GetResult() {
        return _session.QueryOver<Account>()
                        .Where(c => c.Email == Email)
                        .SingleOrDefault<Account>();
    }
}
{% endcodeblock %}

<a href="http://nhforge.org/doc/nh/en/#querysql" target="_blank" rel="external noopener">Native SQL</a>

{% codeblock ItemResultGetAllQuery.cs lang:csharp line_number:true highlight:true %}
public class ItemResultGetAllQuery : IQuery<IEnumerable<ItemResult>> {

    private readonly ISession _session;

    public ItemResultGetAllQuery(ISession session) {
        _session = session;
    }

    public IEnumerable<ItemResult> GetResult() {
        return _session.CreateSQLQuery("SELECT Id, Name, Type FROM Items")
                        .SetResultTransformer(Transformers.AliasToBean<ItemResult>())
                        .List<ItemResult>();
    }
}
{% endcodeblock %}

Obrigado pela visita e espero que tenha gostado, at&#233; a pr&#243;xima.
