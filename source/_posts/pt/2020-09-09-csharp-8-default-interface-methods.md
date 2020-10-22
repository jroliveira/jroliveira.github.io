---
layout: post
title: "Novidades do C# 8.0: Default interface methods"
description: "Post sobre a novidade do C# 8.0: Default interface methods"
date: 2020-09-09 23:00
comments: true
categories:
- desenvolvimento
- csharp
tags:
- csharp
lang: pt
---

Olá, neste artigo eu vou escrever sobre a novidade do [C# 8 default interface methods](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-8#default-interface-methods).
[Neste artigo](/pt/csharp-8) você poderá ver um resumo das novidades que eu acho mais relevantes que vieram no C# 8.

##### Conteúdo:

 - [Antes do C# 8](/pt/csharp-8-default-interface-methods/#Antes-do-C-8-uarr);
 - [Antes do C# 8 (uma opção com interface extensions)](/pt/csharp-8-default-interface-methods/#Antes-do-C-8-uma-opcao-com-interface-extensions-uarr);
 - [Depois do C# 8](/pt/csharp-8-default-interface-methods/#Depois-do-C-8-uarr);
 - [Considerações finais](/pt/csharp-8-default-interface-methods/#Consideracoes-finais-uarr)

<!--more-->

##### Antes do C# 8 [&uarr;](#Conteudo)

{% codeblock lang:csharp line_number:true highlight:true %}
public interface ILimit
{
    IFilterBuilder Limit(in uint limit);
}

public interface ISkip
{
    IFilterBuilder Skip(in uint skip);
}

public interface ISelect
{
    IFilterBuilder Select(params string[] fields);
}

public interface IFilterBuilder : ILimit, ISkip, ISelect
{
    string Build();
}

public sealed class FilterBuilder : IFilterBuilder
{
    private readonly ICollection<string> filters;

    private FilterBuilder() => this.filters = new List<string>();

    public IFilterBuilder Skip(in uint skip)
    {
        var newSkip = skip < 1
            ? 1
            : skip;

        this.filters.Add($"filter[skip]={newSkip}");
        return this;
    }

    public IFilterBuilder Limit(in uint limit)
    {
        var newLimit = limit < 1
            ? 1
            : limit;

        this.filters.Add($"filter[limit]={newLimit}");
        return this;
    }

    public IFilterBuilder Select(params string[] fields)
    {
        foreach (var field in fields)
        {
            this.filters.Add($"filter[fields][{field}]=true");
        }

        return this;
    }

    public string Build() => string.Join("&", this.filters);

    public static IFilterBuilder NewFilterBuilder() => new FilterBuilder();
}
{% endcodeblock %}

##### Antes do C# 8 (uma opção com interface extensions)  [&uarr;](#Conteudo)

Este exemplo foi inspirado no artigo [Pseudo Traits in C#](https://dev.to/htissink/pseudo-traits-in-c-lnp), que traz uma abordagem de como podemos fazer praticamente a mesma coisa sem precisar desta nova funcionalidade.

{% codeblock lang:csharp line_number:true highlight:true %}
public interface IFilterBase
{
    IFilterBuilder AddFilters(params string[] values);
}

public interface ILimit : IFilterBase
{
}

public static partial class FilterExtension
{
    public static IFilterBuilder Limit(this ILimit @this, uint limit)
    {
        var newLimit = limit < 1
            ? 1
            : limit;

        return @this
            .AddFilters($"filter[limit]={newLimit}");
    }
}

public interface ISkip : IFilterBase
{
}

public static partial class FilterExtension
{
    public static IFilterBuilder Skip(this ISkip @this, uint skip)
    {
        var newSkip = skip < 1
            ? 1
            : skip;

        return @this
            .AddFilters($"filter[skip]={newSkip}");
    }
}

public interface ISelect : IFilterBase
{
}

public static partial class FilterExtension
{
    public static IFilterBuilder Select(this ISelect @this, params string[] fields) => @this
        .AddFilters(fields
            .Select(field => $"filter[fields][{field}]=true")
            .ToArray());
}

public interface IFilterBuilder : ILimit, ISkip, ISelect
{
    string Build();
}

public sealed class FilterBuilder : IFilterBuilder
{
    private readonly ICollection<string> filters;

    private FilterBuilder() => this.filters = new List<string>();

    public string Build() => string.Join("&", this.filters);

    public IFilterBuilder AddFilters(params string[] values)
    {
        foreach (var value in values)
        {
            this.filters.Add(value);
        }

        return this;
    }

    public static IFilterBuilder NewFilterBuilder() => new FilterBuilder();
}
{% endcodeblock %}

##### Depois do C# 8 [&uarr;](#Conteudo)

{% codeblock lang:csharp line_number:true highlight:true %}
public interface IFilterBase
{
    IFilterBuilder AddFilters(params string[] values);
}

public interface ISkip : IFilterBase
{
    IFilterBuilder Skip(in uint skip)
    {
        var newSkip = skip < 1
            ? 1
            : skip;

        return this
            .AddFilters($"filter[skip]={newSkip}");
    }
}

public interface ILimit : IFilterBase
{
    IFilterBuilder Limit(in uint limit)
    {
        var newLimit = limit < 1
            ? 1
            : limit;

        return this
            .AddFilters($"filter[limit]={newLimit}");
    }
}

public interface ISelect : IFilterBase
{
    public IFilterBuilder Select(params string[] fields) => this
        .AddFilters(fields
            .Select(field => $"filter[fields][{field}]=true")
            .ToArray());
}

public interface IFilterBuilder : ILimit, ISkip, ISelect
{
    string Build();
}

public sealed class FilterBuilder : IFilterBuilder
{
    private readonly ICollection<string> filters;

    private FilterBuilder() => this.filters = new List<string>();

    public string Build() => string.Join("&", this.filters);

    public IFilterBuilder AddFilters(params string[] values)
    {
        foreach (var value in values)
        {
            this.filters.Add(value);
        }

        return this;
    }

    public static IFilterBuilder NewFilterBuilder() => new FilterBuilder();
}
{% endcodeblock %}

##### Considerações finais [&uarr;](#Conteudo)

Esta nova funcionalidade dividiu um pouco a opinião da comunidade, alguns gostaram e outros nem tanto, abaixo dois artigos que ilustram bem essas opiniões:

 - [Pseudo Traits in C#](https://dev.to/htissink/pseudo-traits-in-c-lnp);
 - [Why interface default implementations in C# are a great thing](https://dev.to/lolle2000la/why-interface-default-implementations-in-c-are-a-great-thing-52nj);

O último exemplo com a implementação desta nova funcionalidade foi retirado do projeto [Http.Query.Filter](https://github.com/jroliveira/http-query-filter/).

Obrigado pela visita 🙂!
