---
layout: post/index
title: "NHibernate"
date: 2014-06-25
comments: true
categories:
- dev
tags:
- csharp
- nhibernate
- singleton
lang: pt
---

Olá pessoal, depois de um tempo parado, vamos falar um pouco de **NHibernate**.
Este post estava pronto a bastante tempo pode ser que alguma coisa não seja mais aplicado nas novas versão do NHibernate.

<!--more-->

**Instalando**

A forma mais simples de instalar o NHibernate é usando o <a href="http://nuget.org/" target="_blank" rel="external noopener">NuGet</a>, abaixo o comando para instalar o NHibernate. No exemplo estou usando a versão **3.3.3.4000** para o **.NET Framework 4.0**.

```
install-package NHibernate
```

**Configurando**

Adicione um arquivo XML na solução chamado **hibernate.cfg.xml**.
Este arquivo irá conter as especificações de conexão a base de dados e outras configurações da conexão.
Abaixo segue uma configuração padrão para o banco **MySQL** e uma aplicação Web:

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

**Domínio**

O domínio abaixo é uma representação de uma conta de jogador, retirada do projeto <a href="https://github.com/junioro/dolrath" target="_blank" rel="external noopener">Dolrath</a> e adaptada para ficar mais didática.

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

Alguns pontos importantes ao notar o domínio é a presença do modificador **virtual** nos métodos e propriedades, este modificador possibilita o NHibernate criar um proxy sobre a nossa classe e que não existe nenhuma presença de infraestrutura de acesso a dados.

**Mapeamento**

O mapeamento abaixo esta escrito em XML, existem outras formas de mapeamento como por exemplo atributos ou por código usando <a href="http://www.fluentnhibernate.org/" target="_blank" rel="external noopener">NHibernate Fluent</a>. Uma vantagens que eu vejo ao usar XML é que você não precisa recompilar a aplicação para alterar alguma regra no mapeamento e a forma de utilização ao meu ver é mais simples e didática.

Abaixo esta o mapeamento da nossa classe de domínio acima.

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

Uma das configurações mais importantes deste mapeamento é o gerador da chave primária, neste exemplo estou usando **hilo**, ele é usado para gerar a chave sem precisar ir até a base de dados não quebramos a <a href="http://martinfowler.com/eaaCatalog/unitOfWork.html" target="_blank" rel="external noopener">Unit Of Work</a>.

Click no elemento abaixo para maiores detalhes de seus atributos.

<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-mapping" target="_blank" rel="external noopener">hibernate-mapping</a>
<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-class" target="_blank" rel="external noopener">class</a>
<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-id" target="_blank" rel="external noopener">id</a>
<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-property" target="_blank" rel="external noopener">property</a>

**Relações**

Abaixo as duas formas de fazer uma relação de **N para N** (<a href="http://nhforge.org/doc/nh/en/#collections-ofvalues" target="_blank" rel="external noopener">many-to-many</a>).

**bag**: É usado quando temos uma situação onde a coleção pode haver valores duplicados.

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

**set**: É usado quando temos uma situação onde a coleção não pode haver valores duplicados.

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

Relação de **N para 1** (<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-manytoone" target="_blank" rel="external noopener">many-to-one</a>).

{% codeblock lang:xml line_number:true highlight:true %}
<class name="Character" table="Characters">
  <id name="Id" type="Int32">
    <generator class="hilo"/>
  </id>

  <many-to-one name="Account" unique="true" column="AccountId" />
</class>
{% endcodeblock %}

Relação de **1 para 1** (<a href="http://nhforge.org/doc/nh/en/#mapping-declaration-onetoone" target="_blank" rel="external noopener">one-to-one</a>).

{% codeblock lang:xml line_number:true highlight:true %}
<class name="Account" table="Accounts">
  <id name="Id" type="Int32">
    <generator class="hilo"/>
  </id>

  <one-to-one name="Character" class="Character" cascade="all" />
</class>
{% endcodeblock %}

**Outras configurações**

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

A **Session Factory** é responsável por construir as sessões.
Quando uma aplicação é iniciada deve-se carregar todas as configurações do NHibernate e mapeamentos para criar a Session Factory, a criação da Session Factory é um processo demorado e deve ser feito apenas uma vez na aplicação.
O código abaixo é uma implementação do padrão <a href="http://www.dofactory.com/Patterns/PatternSingleton.aspx" target="_blank" rel="external noopener">Singleton</a> e garante que a Session Factory será criada apenas uma vez na aplicação.

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

Exitem várias formas de criar uma **session** em uma aplicação web a forma que irei adotar é bem comum, ela cria uma session por cada requisição feita.

Simplesmente vamos criar um **action filter** que irá interceptar a "entrada" e a "saída" da nossa **action** da **controller**.

Na entrada vamos pegar a session usando o **contêiner de dependência** e iniciar uma transação setando o **nível de isolamento** da mesma.
Lista dos <a href="http://msdn.microsoft.com/pt-br/library/system.data.isolationlevel.aspx" target="_blank" rel="external noopener">níveis de isolamentos</a>.

Na saída vamos verificar se houve um erro na requisição. Caso não houve um erro a transação será feito um **commit** da transação, senão será feito um **rollback** na mesma.

No final a Session será destruída.

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

Este **actino filter** será utilizado para poder acoplar e desacoplar a session do NHibernate no contexto atual, para ficar mais simples a utilização vamos registrar ele no **global filter** assim não precisamos decorar a nossa action com esta anotação.

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

Notem que estou recebendo a session no construtor da controller, quem irá fornecer esta session será o contêiner de dependência.
A **action create** do método **post** esta decorada com a anotação **TransactionPerRequest**, isto indica que esta action terá um controle de transação.

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

Existem várias formas de buscar dados usando NHibernate segue alguns abaixo:

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

Obrigado pela visita e espero que tenha gostado, até a próxima.
