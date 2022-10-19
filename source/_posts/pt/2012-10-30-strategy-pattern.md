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

Olá pessoal, vou falar um pouco sobre **Strategy Pattern**, é um **Design Pattern** que ficou famoso depois de ser catalogado pelo **GoF (Gang Of Four)** formado por Erich Gamma, Richard Helm, Ralph Johnson e John Vlissides no livro *"Design Patterns: Elements of Reusable Object-Oriented Software"*.

<!--more-->

Segue abaixo a definição de acordo com o livro:

> "Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it."

Vamos ao exemplo para ficar mais claro a definição.

Imagina que você precisa desenvolver uma funcionalidade que irá validar um usuário. Este é um cenário bem simples e típico podemos fazer esta implementação de várias formas diferentes, abaixo segue um código que em um primeiro momento acho que seria o mais comum.

A primeira classe é uma controller do **asp.net mvc** que terá uma action que irá receber o usuário e a senha por **POST** e chamar a classe que irá validar estas informações.

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

A classe abaixo será responsável por controlar o fluxo de validação do usuário.

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

Nossa classe que será responsável por manipular os dados do usuário.

{% codeblock UserDAO.cs lang:csharp line_number:true highlight:true %}
public class UserDAO {

    public User GetBy(string username) {
        throw new System.NotImplementedException();
    }
}
{% endcodeblock %}

Como mencionado acima, este é um código bem simples, porém, este código é impossível testar unitariamente e caso haja a necessidade de alterar a fonte dos dados também será difícil.

Para resolver este problema, podemos aplicar o **Strategy Pattern**, de forma que iremos passar para a classe **UserApplication** a "estratégia" (classe) de acesso a dados que iremos utilizar, assim fica fácil testar a classe **UserApplication** unitariamente e de mudar a fonte de dados quando necessário.

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

Notem que agora eu passo a dependência do repositório no construtor da minha classe **UserApplication**, sendo assim eu consigo passar qualquer classe que implemente a classe **IUserDAO**.

Abaixo notem que a nossa classe **UserDAO** sofreu uma modificação, agora ela implementa a interface **IUserDAO** sendo assim eu posso passar ela no construtor da nossa classe **UserApplication**.

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

Vocês podem perceber que agora estou passando para a classe **UserApplication** a conexão que ela deverá utilizar. Esta classe de conexão é uma "estratégia" que estou utilizando para acessar as informações do usuário, caso haja necessidade de acessar as informações de outra fonte de dados é necessário apenas implementar outra "estratégia" (classe) que implemente a interface **IUserDAO** e passar para a nossa classe **UserApplication** como mencionado acima.

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

Abaixo outra "estratégia" (classe) de acesso a dados que irá conter os métodos que simulará as operações na base de dados, nos ajudando assim a testar a classe **UserApplication**.

{% codeblock FakeUserDAO.cs lang:csharp line_number:true highlight:true %}
public class FakeUserDAO : IUserDAO {

    public User User { get; set; }

    public User GetBy(string username) {
        return User;
    }
}
{% endcodeblock %}

O teste abaixo é para garantir que as operações da classe **UserApplication** estão de acordo com as regras do negócio.

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

Analisando a definição do pattern, descrita no inicio do post:

O contexto é a classe **UserApplication**.

As estratégias criadas foram as classes que implementam a interface **IUserDAO** no caso a classe **UserDAO** e **FakeUserDAO**.

E os clientes que utilizam a classe **UserApplication** são os testes da classe **UserApplication** e a action da **LoginController**.

Neste post usei os seguintes pacotes: <a href="http://sharptestex.codeplex.com" target="_blank" rel="external noopener">Sharp Tests Ex</a> e <a href="http://www.nunit.org" target="_blank" rel="external noopener">NUnit</a>.

Existem outras aplicações mais comuns para o **Strategy Pattern** como: criptografias, logs entre outros cenários, escolhi este cenário também para demonstrar a aplicação de testes unitários em códigos "legados".

Espero que tenham gostado do exemplo e até a próxima.
