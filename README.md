<p align="center">
  <h3 align="center">Awlibs</h3>

  <p align="center">
    基础工具库
  </p>
</p>

## Table of contents

- [Quick start](#quick-start)
- [Status](#status)
- [What's included](#whats-included)
- [Atinterceptor](#atinterceptor)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Community](#community)
- [Versioning](#versioning)
- [Creators](#creators)
- [Copyright and license](#copyright-and-license)

## Quick start

- Install with [npm](https://www.npmjs.com/): `npm install awlibs`

## Status
[![npm version](https://img.shields.io/npm/v/awlibs.svg)](https://www.npmjs.com/package/awlibs)

## What's included
包含 atinterceptor、awlvalidator、formhandler、lazychain、pcurry、promiseajax 6 个工具，下面分别介绍。

## Atinterceptor

异步任务拦截器，把一个异步任务抽象成一个请求 -> 响应的过程，对异步任务的返回结果进行归类，方便后续的统一处理，内置异步任务的状态标记（ready/pending），可以防止同一任务的重复执行。

```
const atinterceptor = require('awlibs/atinterceptor');
const asyncTaskTrigger = atinterceptor();

asyncTaskTrigger(() => {
  return [
    fetch()
  ];
}, true, 'getList');

```

- Install with [Composer](https://getcomposer.org/): `composer require twbs/bootstrap:4.0.0`
- Install with [Composer](https://getcomposer.org/): `composer require twbs/bootstrap:4.0.0`
- Install with [Composer](https://getcomposer.org/): `composer require twbs/bootstrap:4.0.0`
