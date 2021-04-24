---
layout: post/index
title: "Strategy Pattern"
date: 2012-10-30
comments: true
categories:
- dev
tags:
- csharp
- design pattern
- di
- ioc
lang: pt
---

Ol&#225; pessoal, vou falar um pouco sobre **Strategy Pattern**, &#233; um **Design Pattern** que ficou famoso depois de ser catalogado pelo **GoF (Gang Of Four)** formado por Erich Gamma, Richard Helm, Ralph Johnson e John Vlissides no livro *"Design Patterns: Elements of Reusable Object-Oriented Software"*.

<!--more-->

Segue abaixo a defini&#231;&#227;o de acordo com o livro:

> "Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it."

Vamos ao exemplo para ficar mais claro a defini&#231;&#227;o.

Imagina que voc&#234; precisa desenvolver uma funcionalidade que ir&#225; validar um usu&#225;rio. Este &#233; um cen&#225;rio bem simples e t&#237;pico podemos fazer esta implementa&#231;&#227;o de v&#225;rias formas diferentes, abaixo segue um c&#243;digo que em um primeiro momento acho que seria o mais comum.

A primeira classe &#233; uma controller do **asp.net mvc** que ter&#225; uma action que ir&#225; receber o usu&#225;rio e a senha por **POST** e chamar a classe que ir&#225; validar estas informa&#231;&#245;es.

{% codeblock LoginController.cs lang:csharp line_number:true highlight:true %}
public class LoginController : Controller {

    public ActionResult Index() {
        return View();
    }

    [HttpPost]
    public ActionResult Index(LoginViewModel viewModel) {
        if (!ModelState.IsValid) return View(viewModel);

        var username = viewModel.Username;
        var password = viewModel.Password;

        var application = new UserApplication();
        var valid = application.Validate(username, password);

        //Caso o usuario nao seja valido, retorna para a view.
        if (!valid) return View(viewModel);

        //Autentica o usuario no sistema.
    }
}
{% endcodeblock %}

A classe abaixo ser&#225; respons&#225;vel por controlar o fluxo de valida&#231;&#227;o do usu&#225;rio.

{% codeblock UserApplication.cs lang:csharp line_number:true highlight:true %}
public class UserApplication {

    public bool Validate(string username, string password) {
        var userDAO = new UserDAO();
        var user = userDAO.GetBy(username);
        if (user == null) return false;

        return user.Check(password);
    }
}
{% endcodeblock %}

Nossa classe que ser&#225; respons&#225;vel por manipular os dados do usu&#225;rio.

{% codeblock UserDAO.cs lang:csharp line_number:true highlight:true %}
public class UserDAO {

    public User GetBy(string username) {
        throw new System.NotImplementedException();
    }
}
{% endcodeblock %}

Como mencionado acima, este &#233; um c&#243;digo bem simples, por&#233;m, este c&#243;digo &#233; imposs&#237;vel testar unitariamente e caso haja a necessidade de alterar a fonte dos dados tamb&#233;m ser&#225; dif&#237;cil.

Para resolver este problema, podemos aplicar o **Strategy Pattern**, de forma que iremos passar para a classe **UserApplication** a "estrat&#233;gia" (classe) de acesso a dados que iremos utilizar, assim fica f&#225;cil testar a classe **UserApplication** unitariamente e de mudar a fonte de dados quando necess&#225;rio.

{% codeblock UserApplication.cs lang:csharp line_number:true highlight:true %}
public class UserApplication {

    private readonly IUserDAO _userDAO;

    public UserApplication(IUserDAO userDAO) {
        _userDAO = userDAO;
    }

    public bool Validate(string username, string password) {
        var user = _userDAO.GetBy(username);
        if (user == null) return false;

        return user.Check(password);
    }
}
{% endcodeblock %}

Notem que agora eu passo a depend&#234;ncia do reposit&#243;rio no construtor da minha classe **UserApplication**, sendo assim eu consigo passar qualquer classe que implemente a classe **IUserDAO**.

Abaixo notem que a nossa classe **UserDAO** sofreu uma modifica&#231;&#227;o, agora ela implementa a interface **IUserDAO** sendo assim eu posso passar ela no construtor da nossa classe **UserApplication**.

{% codeblock UserDAO.cs lang:csharp line_number:true highlight:true %}
public interface IUserDAO {

    User GetBy(string username);
}

public class UserDAO : IUserDAO {

    public User GetBy(string username) {
        throw new System.NotImplementedException();
    }
}
{% endcodeblock %}

Voc&#234;s podem perceber que agora estou passando para a classe **UserApplication** a conex&#227;o que ela dever&#225; utilizar. Esta classe de conex&#227;o &#233; uma "estrat&#233;gia" que estou utilizando para acessar as informa&#231;&#245;es do usu&#225;rio, caso haja necessidade de acessar as informa&#231;&#245;es de outra fonte de dados &#233; necess&#225;rio apenas implementar outra "estrat&#233;gia" (classe) que implemente a interface **IUserDAO** e passar para a nossa classe **UserApplication** como mencionado acima.

{% codeblock LoginController.cs lang:csharp line_number:true highlight:true %}
public class LoginController : Controller {

    public ActionResult Index() {
        return View();
    }

    [HttpPost]
    public ActionResult Index(LoginViewModel viewModel) {
        if (!ModelState.IsValid) return View(viewModel);

        var username = viewModel.Username;
        var password = viewModel.Password;

        IUserDAO dao = new UserDAO();
        var application = new UserApplication(dao);
        var valid = application.Validate(username, password);

        //Caso o usuario nao seja valido, retorna para a view.
        if (!valid) return View(viewModel);

        //Autentica o usuario no sistema.
        throw new NotImplementedException();
    }
}
{% endcodeblock %}

Abaixo outra "estrat&#233;gia" (classe) de acesso a dados que ir&#225; conter os m&#233;todos que simular&#225; as opera&#231;&#245;es na base de dados, nos ajudando assim a testar a classe **UserApplication**.

{% codeblock FakeUserDAO.cs lang:csharp line_number:true highlight:true %}
public class FakeUserDAO : IUserDAO {

    public User User { get; set; }

    public User GetBy(string username) {
        return User;
    }
}
{% endcodeblock %}

O teste abaixo &#233; para garantir que as opera&#231;&#245;es da classe **UserApplication** est&#227;o de acordo com as regras do neg&#243;cio.

{% codeblock UserApplicationTest.cs lang:csharp line_number:true highlight:true %}
[TestFixture]
public class UserApplicationTest {

    private const string Username = "username";
    private const string Password = "password";

    private FakeUserDAO _fakeUserDAO;

    [SetUp]
    public void SetUp() {
        _fakeUserDAO = new FakeUserDAO();
    }

    [Test]
    public void Validate_QuandoUsuarioNaoExiste_RetornaFalse() {
        var userApplication = new UserApplication(_fakeUserDAO);
        var userIsValid = userApplication.Validate(Username, Password);

        userIsValid.Should().Be.False();
    }

    [Test]
    public void Validate_QuandoASenhaEhInvalida_RetornaFalse() {
        _fakeUserDAO.User = new User { Password = "pass" };

        var userApplication = new UserApplication(_fakeUserDAO);
        var userIsValid = userApplication.Validate(Username, Password);

        userIsValid.Should().Be.False();
    }

    [Test]
    public void Validate_QuandoASenhaEhValida_RetornaTrue() {
        _fakeUserDAO.User = new User { Password = Password };

        var userApplication = new UserApplication(_fakeUserDAO);
        var userIsValid = userApplication.Validate(Username, Password);

        userIsValid.Should().Be.True();
    }
}
{% endcodeblock %}

Analisando a defini&#231;&#227;o do pattern, descrita no inicio do post:

O contexto &#233; a classe **UserApplication**.

As estrat&#233;gias criadas foram as classes que implementam a interface **IUserDAO** no caso a classe **UserDAO** e **FakeUserDAO**.

E os clientes que utilizam a classe **UserApplication** s&#227;o os testes da classe **UserApplication** e a action da **LoginController**.

Neste post usei os seguintes pacotes: <a href="http://sharptestex.codeplex.com" target="_blank" rel="external noopener">Sharp Tests Ex</a> e <a href="http://www.nunit.org" target="_blank" rel="external noopener">NUnit</a>.

Existem outras aplica&#231;&#245;es mais comuns para o **Strategy Pattern** como: criptografias, logs entre outros cen&#225;rios, escolhi este cen&#225;rio tamb&#233;m para demonstrar a aplica&#231;&#227;o de testes unit&#225;rios em c&#243;digos "legados".

Espero que tenham gostado do exemplo e at&#233; a pr&#243;xima.
