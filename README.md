
# fastify-account


### 描述

fastify的用户管理账号等实现


### 安装

```shell
npm i --save @kne/fastify-account
```

### 示例

#### 示例代码



### API

---
title: "@kne/fastify-account v1.0.0-alpha.14"
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="-kne-fastify-account">@kne/fastify-account v1.0.0-alpha.14</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

fastify的用户管理账号等实现

<h1 id="-kne-fastify-account-default">Default</h1>

## get__api_v1_account_admin_getRoleList

`GET /api/v1/account/admin/getRoleList`

<h3 id="get__api_v1_account_admin_getrolelist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|tenantId|query|string|true|none|
|perPage|query|number|false|none|
|currentPage|query|number|false|none|
|filter|query|object|false|none|

<h3 id="get__api_v1_account_admin_getrolelist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_addRole

`POST /api/v1/account/admin/addRole`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "tenantId",
    "name"
  ],
  "properties": {
    "tenantId": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_addrole-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» tenantId|body|string|true|none|
|» name|body|string|true|none|
|» description|body|string|false|none|

<h3 id="post__api_v1_account_admin_addrole-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_saveRole

`POST /api/v1/account/admin/saveRole`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "name",
    "id"
  ],
  "properties": {
    "id": {
      "type": "number"
    },
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_saverole-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|number|true|none|
|» name|body|string|true|none|
|» description|body|string|false|none|

<h3 id="post__api_v1_account_admin_saverole-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_removeRole

`POST /api/v1/account/admin/removeRole`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "number"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_removerole-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|number|true|none|

<h3 id="post__api_v1_account_admin_removerole-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_admin_getRolePermissionList

`GET /api/v1/account/admin/getRolePermissionList`

<h3 id="get__api_v1_account_admin_getrolepermissionlist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|query|number|true|none|

<h3 id="get__api_v1_account_admin_getrolepermissionlist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_saveRolePermissionList

`POST /api/v1/account/admin/saveRolePermissionList`

<h3 id="post__api_v1_account_admin_saverolepermissionlist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_admin_getAllTenantList

`GET /api/v1/account/admin/getAllTenantList`

<h3 id="get__api_v1_account_admin_getalltenantlist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|name|query|string|false|none|
|serviceStartTime|query|string(date-time)|false|none|
|serviceEndTime|query|string(date-time)|false|none|
|perPage|query|number|false|none|
|currentPage|query|number|false|none|

<h3 id="get__api_v1_account_admin_getalltenantlist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_admin_getTenantInfo

`GET /api/v1/account/admin/getTenantInfo`

<h3 id="get__api_v1_account_admin_gettenantinfo-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|query|string|false|none|

<h3 id="get__api_v1_account_admin_gettenantinfo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_addTenant

`POST /api/v1/account/admin/addTenant`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "name",
    "accountNumber",
    "serviceStartTime",
    "serviceEndTime"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "accountNumber": {
      "type": "number"
    },
    "serviceStartTime": {
      "type": "string",
      "format": "date-time"
    },
    "serviceEndTime": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_addtenant-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|true|none|
|» accountNumber|body|number|true|none|
|» serviceStartTime|body|string(date-time)|true|none|
|» serviceEndTime|body|string(date-time)|true|none|

<h3 id="post__api_v1_account_admin_addtenant-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_saveTenant

`POST /api/v1/account/admin/saveTenant`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "id",
    "name",
    "accountNumber",
    "serviceStartTime",
    "serviceEndTime"
  ],
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "accountNumber": {
      "type": "number"
    },
    "serviceStartTime": {
      "type": "string",
      "format": "date-time"
    },
    "serviceEndTime": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_savetenant-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|string|true|none|
|» name|body|string|true|none|
|» accountNumber|body|number|true|none|
|» serviceStartTime|body|string(date-time)|true|none|
|» serviceEndTime|body|string(date-time)|true|none|

<h3 id="post__api_v1_account_admin_savetenant-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_tenant_addOrg

`POST /api/v1/account/admin/tenant/addOrg`

<h3 id="post__api_v1_account_admin_tenant_addorg-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_admin_tenant_orgList

`GET /api/v1/account/admin/tenant/orgList`

<h3 id="get__api_v1_account_admin_tenant_orglist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|query|string|false|none|

<h3 id="get__api_v1_account_admin_tenant_orglist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_tenant_editOrg

`POST /api/v1/account/admin/tenant/editOrg`

<h3 id="post__api_v1_account_admin_tenant_editorg-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_tenant_removeOrg

`POST /api/v1/account/admin/tenant/removeOrg`

<h3 id="post__api_v1_account_admin_tenant_removeorg-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_admin_getTenantUserList

`GET /api/v1/account/admin/getTenantUserList`

<h3 id="get__api_v1_account_admin_gettenantuserlist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|tenantId|query|string|false|none|
|filter|query|object|false|none|
|currentPage|query|number|false|none|
|perPage|query|number|false|none|

<h3 id="get__api_v1_account_admin_gettenantuserlist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_addTenantUser

`POST /api/v1/account/admin/addTenantUser`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "tenantId",
    "userId",
    "name"
  ],
  "properties": {
    "tenantId": {
      "type": "string"
    },
    "roleIds": {
      "type": "array",
      "items": {
        "type": "number"
      },
      "default": []
    },
    "orgIds": {
      "type": "array",
      "items": {
        "type": "number"
      },
      "default": []
    },
    "userId": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "avatar": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "description": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_addtenantuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» tenantId|body|string|true|none|
|» roleIds|body|[number]|false|none|
|» orgIds|body|[number]|false|none|
|» userId|body|string|true|none|
|» name|body|string|true|none|
|» avatar|body|string|false|none|
|» phone|body|string|false|none|
|» email|body|string|false|none|
|» description|body|string|false|none|

<h3 id="post__api_v1_account_admin_addtenantuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_saveTenantUser

`POST /api/v1/account/admin/saveTenantUser`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "tenantId",
    "name"
  ],
  "properties": {
    "tenantId": {
      "type": "string"
    },
    "roleIds": {
      "type": "array",
      "items": {
        "type": "number"
      },
      "default": []
    },
    "orgIds": {
      "type": "array",
      "items": {
        "type": "number"
      },
      "default": []
    },
    "name": {
      "type": "string"
    },
    "avatar": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "description": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_savetenantuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» tenantId|body|string|true|none|
|» roleIds|body|[number]|false|none|
|» orgIds|body|[number]|false|none|
|» name|body|string|true|none|
|» avatar|body|string|false|none|
|» phone|body|string|false|none|
|» email|body|string|false|none|
|» description|body|string|false|none|

<h3 id="post__api_v1_account_admin_savetenantuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_deleteTenantUser

`POST /api/v1/account/admin/deleteTenantUser`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "tenantId",
    "tenantUserId"
  ],
  "properties": {
    "tenantId": {
      "type": "string"
    },
    "tenantUserId": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_deletetenantuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» tenantId|body|string|true|none|
|» tenantUserId|body|string|true|none|

<h3 id="post__api_v1_account_admin_deletetenantuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_closeTenant

`POST /api/v1/account/admin/closeTenant`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "tenantId"
  ],
  "properties": {
    "tenantId": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_closetenant-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» tenantId|body|string|true|none|

<h3 id="post__api_v1_account_admin_closetenant-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_openTenant

`POST /api/v1/account/admin/openTenant`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "tenantId"
  ],
  "properties": {
    "tenantId": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_opentenant-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» tenantId|body|string|true|none|

<h3 id="post__api_v1_account_admin_opentenant-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_closeTenantUser

`POST /api/v1/account/admin/closeTenantUser`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "tenantId",
    "tenantUserId"
  ],
  "properties": {
    "tenantId": {
      "type": "string"
    },
    "tenantUserId": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_closetenantuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» tenantId|body|string|true|none|
|» tenantUserId|body|string|true|none|

<h3 id="post__api_v1_account_admin_closetenantuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_openTenantUser

`POST /api/v1/account/admin/openTenantUser`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "tenantId",
    "tenantUserId"
  ],
  "properties": {
    "tenantId": {
      "type": "string"
    },
    "tenantUserId": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_opentenantuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» tenantId|body|string|true|none|
|» tenantUserId|body|string|true|none|

<h3 id="post__api_v1_account_admin_opentenantuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_admin_getInviteList

`GET /api/v1/account/admin/getInviteList`

<h3 id="get__api_v1_account_admin_getinvitelist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|tenantId|query|string|true|none|

<h3 id="get__api_v1_account_admin_getinvitelist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_addInviteToken

`POST /api/v1/account/admin/addInviteToken`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "tenantId"
  ],
  "properties": {
    "tenantId": {
      "type": "string"
    },
    "info": {
      "type": "object",
      "properties": {
        "roleIds": {
          "type": "array",
          "items": {
            "type": "number"
          },
          "default": []
        },
        "orgIds": {
          "type": "array",
          "items": {
            "type": "number"
          },
          "default": []
        }
      }
    }
  }
}
```

<h3 id="post__api_v1_account_admin_addinvitetoken-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» tenantId|body|string|true|none|
|» info|body|object|false|none|
|»» roleIds|body|[number]|false|none|
|»» orgIds|body|[number]|false|none|

<h3 id="post__api_v1_account_admin_addinvitetoken-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_deleteInviteToken

`POST /api/v1/account/admin/deleteInviteToken`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "number"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_deleteinvitetoken-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|number|true|none|

<h3 id="post__api_v1_account_admin_deleteinvitetoken-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_tenant_getUserTenant

`GET /api/v1/account/tenant/getUserTenant`

<h3 id="get__api_v1_account_tenant_getusertenant-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_tenant_getTenantUserInfo

`GET /api/v1/account/tenant/getTenantUserInfo`

<h3 id="get__api_v1_account_tenant_gettenantuserinfo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_tenant_getTenantUserList

`GET /api/v1/account/tenant/getTenantUserList`

<h3 id="get__api_v1_account_tenant_gettenantuserlist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|object|false|none|
|currentPage|query|number|false|none|
|perPage|query|number|false|none|

<h3 id="get__api_v1_account_tenant_gettenantuserlist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_tenant_orgList

`GET /api/v1/account/tenant/orgList`

<h3 id="get__api_v1_account_tenant_orglist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_getUserInfo

`GET /api/v1/account/getUserInfo`

<h3 id="get__api_v1_account_getuserinfo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_setCurrentTenantId

`POST /api/v1/account/setCurrentTenantId`

> Body parameter

```json
{
  "type": "object",
  "required": [
    "tenantId"
  ],
  "properties": {
    "tenantId": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_setcurrenttenantid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» tenantId|body|string|true|none|

<h3 id="post__api_v1_account_setcurrenttenantid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-kne-fastify-account--">账号</h1>

## post__api_v1_account_sendEmailCode

`POST /api/v1/account/sendEmailCode`

*发送邮箱验证码*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "email"
  ],
  "properties": {
    "email": {
      "type": "string",
      "description": "邮箱"
    }
  }
}
```

<h3 id="post__api_v1_account_sendemailcode-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» email|body|string|true|邮箱|

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {
    "code": {
      "type": "string",
      "description": "验证码"
    }
  }
}
```

<h3 id="post__api_v1_account_sendemailcode-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="post__api_v1_account_sendemailcode-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» code|string|false|none|验证码|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_sendSMSCode

`POST /api/v1/account/sendSMSCode`

*发送短信验证码*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "phone"
  ],
  "properties": {
    "phone": {
      "type": "string",
      "description": "电话"
    }
  }
}
```

<h3 id="post__api_v1_account_sendsmscode-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» phone|body|string|true|电话|

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {
    "code": {
      "type": "string",
      "description": "验证码"
    }
  }
}
```

<h3 id="post__api_v1_account_sendsmscode-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="post__api_v1_account_sendsmscode-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» code|string|false|none|验证码|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_validateCode

`POST /api/v1/account/validateCode`

*验证码验证*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "name",
    "type",
    "code"
  ],
  "properties": {
    "name": {
      "type": "string",
      "description": "被验证的账号，手机或邮箱"
    },
    "type": {
      "type": "number",
      "description": "0:手机注册,1:邮箱注册,2:手机登录,3:邮箱登录,4:验证租户管理员"
    },
    "code": {
      "type": "string",
      "description": "接受到的验证码"
    }
  }
}
```

<h3 id="post__api_v1_account_validatecode-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|true|被验证的账号，手机或邮箱|
|» type|body|number|true|0:手机注册,1:邮箱注册,2:手机登录,3:邮箱登录,4:验证租户管理员|
|» code|body|string|true|接受到的验证码|

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {}
}
```

<h3 id="post__api_v1_account_validatecode-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="post__api_v1_account_validatecode-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_accountIsExists

`POST /api/v1/account/accountIsExists`

*账号是否已存在*

> Body parameter

```json
{
  "oneOf": [
    {
      "type": "object",
      "required": [
        "phone"
      ],
      "properties": {
        "phone": {
          "type": "string",
          "description": "电话"
        }
      }
    },
    {
      "type": "object",
      "required": [
        "email"
      ],
      "properties": {
        "email": {
          "type": "string",
          "description": "邮箱"
        }
      }
    }
  ]
}
```

<h3 id="post__api_v1_account_accountisexists-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|any|false|none|

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {
    "isExists": {
      "type": "boolean",
      "description": "true已存在，false不存在"
    }
  }
}
```

<h3 id="post__api_v1_account_accountisexists-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="post__api_v1_account_accountisexists-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» isExists|boolean|false|none|true已存在，false不存在|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_register

`POST /api/v1/account/register`

*注册账号*

> Body parameter

```json
{
  "oneOf": [
    {
      "type": "object",
      "required": [
        "phone",
        "password",
        "code"
      ],
      "properties": {
        "avatar": {
          "type": "string",
          "description": "头像图片id"
        },
        "phone": {
          "type": "string",
          "description": "电话"
        },
        "code": {
          "type": "string",
          "description": "验证码"
        },
        "password": {
          "type": "string",
          "description": "密码（需要md5加密）"
        },
        "invitationCode": {
          "type": "string",
          "description": "邀请码，用来默认加入租户"
        },
        "nickname": {
          "type": "string",
          "description": "昵称"
        },
        "gender": {
          "type": "string",
          "description": "性别"
        },
        "birthday": {
          "type": "string",
          "format": "date",
          "description": "出生日期"
        },
        "description": {
          "type": "string",
          "description": "个人简介"
        }
      }
    },
    {
      "type": "object",
      "required": [
        "email",
        "password",
        "code"
      ],
      "properties": {
        "avatar": {
          "type": "string",
          "description": "头像图片id"
        },
        "email": {
          "type": "string",
          "description": "邮箱"
        },
        "code": {
          "type": "string",
          "description": "验证码"
        },
        "password": {
          "type": "string",
          "description": "密码（需要md5加密）"
        },
        "invitationCode": {
          "type": "string",
          "description": "邀请码，用来默认加入租户"
        },
        "nickname": {
          "type": "string",
          "description": "昵称"
        },
        "gender": {
          "type": "string",
          "description": "性别"
        },
        "birthday": {
          "type": "string",
          "format": "date",
          "description": "出生日期"
        },
        "description": {
          "type": "string",
          "description": "个人简介"
        }
      }
    }
  ]
}
```

<h3 id="post__api_v1_account_register-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|any|false|none|

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {}
}
```

<h3 id="post__api_v1_account_register-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="post__api_v1_account_register-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_login

`POST /api/v1/account/login`

*登录*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "username",
    "password"
  ],
  "properties": {
    "username": {
      "type": "string",
      "description": "用户名"
    },
    "password": {
      "type": "string",
      "description": "密码"
    }
  }
}
```

<h3 id="post__api_v1_account_login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» username|body|string|true|用户名|
|» password|body|string|true|密码|

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {
    "token": {
      "type": "string",
      "description": "用户token"
    },
    "currentTenantId": {
      "type": "string",
      "description": "当前租户id"
    }
  }
}
```

<h3 id="post__api_v1_account_login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="post__api_v1_account_login-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» token|string|false|none|用户token|
|» currentTenantId|string|false|none|当前租户id|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-kne-fastify-account--">管理后台</h1>

## post__api_v1_account_initSuperAdmin

`POST /api/v1/account/initSuperAdmin`

*初始化用户为管理员*

用于系统初始化时，设置第一个用户，只能使用一次，其他用户由该用户创建

<h3 id="post__api_v1_account_initsuperadmin-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_admin_getSuperAdminInfo

`GET /api/v1/account/admin/getSuperAdminInfo`

*获取管理员信息*

> Example responses

> 200 Response

```json
{
  "type": "object",
  "properties": {
    "userInfo": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "用户id"
        },
        "nickname": {
          "type": "string",
          "description": "用户昵称"
        },
        "email": {
          "type": "string",
          "description": "邮箱"
        },
        "phone": {
          "type": "string",
          "description": "电话"
        },
        "gender": {
          "type": "string",
          "description": "性别"
        },
        "birthday": {
          "type": "string",
          "format": "date",
          "description": "出生日期"
        },
        "description": {
          "type": "string",
          "description": "个人简介"
        },
        "currentTenantId": {
          "type": "string",
          "description": "当前租户ID"
        },
        "status": {
          "type": "number",
          "description": "状态"
        }
      }
    }
  }
}
```

<h3 id="get__api_v1_account_admin_getsuperadmininfo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="get__api_v1_account_admin_getsuperadmininfo-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» userInfo|object|false|none|none|
|»» id|string|false|none|用户id|
|»» nickname|string|false|none|用户昵称|
|»» email|string|false|none|邮箱|
|»» phone|string|false|none|电话|
|»» gender|string|false|none|性别|
|»» birthday|string(date)|false|none|出生日期|
|»» description|string|false|none|个人简介|
|»» currentTenantId|string|false|none|当前租户ID|
|»» status|number|false|none|状态|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_setSuperAdmin

`POST /api/v1/account/admin/setSuperAdmin`

*设置用户为超级管理员*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "status",
    "userId"
  ],
  "properties": {
    "status": {
      "type": "boolean",
      "description": "true:将用户设置为超级管理员,false:取消用户超级管理员"
    },
    "userId": {
      "type": "string",
      "description": "用户ID"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_setsuperadmin-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» status|body|boolean|true|true:将用户设置为超级管理员,false:取消用户超级管理员|
|» userId|body|string|true|用户ID|

<h3 id="post__api_v1_account_admin_setsuperadmin-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_addUser

`POST /api/v1/account/admin/addUser`

*添加用户*

> Body parameter

```json
{
  "type": "object",
  "properties": {}
}
```

<h3 id="post__api_v1_account_admin_adduser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

<h3 id="post__api_v1_account_admin_adduser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_admin_getAllUserList

`GET /api/v1/account/admin/getAllUserList`

*获取用户列表*

<h3 id="get__api_v1_account_admin_getalluserlist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|perPage|query|number|false|none|
|currentPage|query|number|false|none|

<h3 id="get__api_v1_account_admin_getalluserlist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_resetUserPassword

`POST /api/v1/account/admin/resetUserPassword`

*重置用户账号密码*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "userId",
    "password"
  ],
  "properties": {
    "password": {
      "type": "string"
    },
    "userId": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_resetuserpassword-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» password|body|string|true|none|
|» userId|body|string|true|none|

<h3 id="post__api_v1_account_admin_resetuserpassword-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_saveUser

`POST /api/v1/account/admin/saveUser`

*修改用户信息*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string"
    },
    "avatar": {
      "type": "string"
    },
    "nickname": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "description": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_saveuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|string|true|none|
|» avatar|body|string|false|none|
|» nickname|body|string|false|none|
|» phone|body|string|false|none|
|» email|body|string|false|none|
|» description|body|string|false|none|

<h3 id="post__api_v1_account_admin_saveuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_closeUser

`POST /api/v1/account/admin/closeUser`

*关闭用户*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_closeuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|string|true|none|

<h3 id="post__api_v1_account_admin_closeuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_openUser

`POST /api/v1/account/admin/openUser`

*将用户设置为正常*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_openuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|string|true|none|

<h3 id="post__api_v1_account_admin_openuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-kne-fastify-account--">管理后台-权限</h1>

## post__api_v1_account_admin_addApplication

`POST /api/v1/account/admin/addApplication`

*添加应用*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "name",
    "code"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "url": {
      "type": "string"
    },
    "avatar": {
      "type": "string"
    },
    "code": {
      "type": "string"
    },
    "description": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_addapplication-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|true|none|
|» url|body|string|false|none|
|» avatar|body|string|false|none|
|» code|body|string|true|none|
|» description|body|string|false|none|

<h3 id="post__api_v1_account_admin_addapplication-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_saveApplication

`POST /api/v1/account/admin/saveApplication`

*修改应用*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "id",
    "name",
    "code"
  ],
  "properties": {
    "id": {
      "type": "string"
    },
    "url": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "avatar": {
      "type": "string"
    },
    "code": {
      "type": "string"
    },
    "description": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_saveapplication-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|string|true|none|
|» url|body|string|false|none|
|» name|body|string|true|none|
|» avatar|body|string|false|none|
|» code|body|string|true|none|
|» description|body|string|false|none|

<h3 id="post__api_v1_account_admin_saveapplication-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_deleteApplication

`POST /api/v1/account/admin/deleteApplication`

*删除应用*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_deleteapplication-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|string|true|none|

<h3 id="post__api_v1_account_admin_deleteapplication-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_admin_getApplicationList

`GET /api/v1/account/admin/getApplicationList`

*获取应用列表*

<h3 id="get__api_v1_account_admin_getapplicationlist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|tenantId|query|string|false|none|

<h3 id="get__api_v1_account_admin_getapplicationlist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_addPermission

`POST /api/v1/account/admin/addPermission`

*添加应用权限*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "applicationId",
    "name",
    "code"
  ],
  "properties": {
    "applicationId": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "code": {
      "type": "string"
    },
    "type": {
      "type": "number"
    },
    "isModule": {
      "type": "number"
    },
    "isMust": {
      "type": "number"
    },
    "pid": {
      "type": "number"
    },
    "description": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_addpermission-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» applicationId|body|string|true|none|
|» name|body|string|true|none|
|» code|body|string|true|none|
|» type|body|number|false|none|
|» isModule|body|number|false|none|
|» isMust|body|number|false|none|
|» pid|body|number|false|none|
|» description|body|string|false|none|

<h3 id="post__api_v1_account_admin_addpermission-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_admin_getPermissionList

`GET /api/v1/account/admin/getPermissionList`

*获取应用权限列表*

<h3 id="get__api_v1_account_admin_getpermissionlist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|applicationId|query|string|true|none|
|tenantId|query|string|false|none|

<h3 id="get__api_v1_account_admin_getpermissionlist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_exportPermissionList

`POST /api/v1/account/admin/exportPermissionList`

*导出应用权限列表*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "applicationIds"
  ],
  "properties": {
    "applicationIds": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "tenantId": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_exportpermissionlist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» applicationIds|body|[string]|true|none|
|» tenantId|body|string|false|none|

<h3 id="post__api_v1_account_admin_exportpermissionlist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_deletePermission

`POST /api/v1/account/admin/deletePermission`

*删除应用权限*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_deletepermission-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|string|true|none|

<h3 id="post__api_v1_account_admin_deletepermission-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_savePermission

`POST /api/v1/account/admin/savePermission`

*修改应用权限*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "type": {
      "type": "number"
    },
    "isMust": {
      "type": "number"
    },
    "description": {
      "type": "string"
    }
  }
}
```

<h3 id="post__api_v1_account_admin_savepermission-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|string|true|none|
|» name|body|string|false|none|
|» type|body|number|false|none|
|» isMust|body|number|false|none|
|» description|body|string|false|none|

<h3 id="post__api_v1_account_admin_savepermission-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_v1_account_admin_getTenantPermissionList

`GET /api/v1/account/admin/getTenantPermissionList`

*获取租户应用权限配置*

<h3 id="get__api_v1_account_admin_gettenantpermissionlist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|tenantId|query|string|true|none|

<h3 id="get__api_v1_account_admin_gettenantpermissionlist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_v1_account_admin_saveTenantPermissionList

`POST /api/v1/account/admin/saveTenantPermissionList`

*修改租户应用权限配置*

> Body parameter

```json
{
  "type": "object",
  "required": [
    "tenantId",
    "applications",
    "permissions"
  ],
  "properties": {
    "tenantId": {
      "type": "string"
    },
    "applications": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "permissions": {
      "type": "array",
      "items": {
        "type": "number"
      }
    }
  }
}
```

<h3 id="post__api_v1_account_admin_savetenantpermissionlist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» tenantId|body|string|true|none|
|» applications|body|[string]|true|none|
|» permissions|body|[number]|true|none|

<h3 id="post__api_v1_account_admin_savetenantpermissionlist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas


