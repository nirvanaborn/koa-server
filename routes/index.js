const router = require("koa-router")();
const userService = require("../config/mysqlConfig");
const nanoid = require("nanoid");
const bufferToBase64 = require("../utils/bufferToBase64");

router.get("/", async (ctx, next) => {
  await ctx.render("index", {
    title: "Hello Koa 2!",
  });
});

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json",
  };
});

// 登录(POST请求)
router.post("/login", async (ctx, next) => {
  let { account, password } = ctx.request.body;
  let select = `select*from users where account='${account}' and password='${password}'`;
  const res = await userService.query(select);
  if (res.length <= 0) {
    ctx.body = { code: 204, msg: "登录失败" };
    return;
  }
  if (res.length > 1) {
    ctx.body = { code: 500, msg: "服务器错误" };
    return;
  }
  ctx.body = { code: 200, msg: "登陆成功" };
});

// 注册(POST请求)
router.post("/register", async (ctx, next) => {
  let { account, password, userName, avatar } = ctx.request.body;
  let select = `select*from users where account='${account}'`;
  const resList = await userService.query(select);
  if (resList.length >= 1) {
    ctx.body = { code: 204, msg: "账号已存在" };
    return;
  }
  let insert = `insert into users(id,account,password${
    userName ? ",userName" : ""
  },avatar) values ('${nanoid.nanoid(10)}','${account}','${password}'${
    userName ? `,'${userName}'` : ""
  },'${avatar}')`;
  await userService.query(insert);
  ctx.body = { code: 200, msg: "注册成功" };
});

// 测试上传(POST请求)
router.post("/testUpdate", async (ctx, next) => {
  let { imageUrl } = ctx.request.body;
  let insert = `insert into testImages(url) values ('${imageUrl}')`;
  await userService.query(insert);
  ctx.body = { code: 200, msg: "上传成功" };
});

// 测试读取图片(GET请求)
router.get("/getImage", async (ctx, next) => {
  let select = `select*from testImages`;
  const res = await userService.query(select);
  let url = bufferToBase64.bufferToBase64(res[0].url);
  ctx.body = { code: 200, url, msg: "查询成功" };
});
module.exports = router;
