const router = require("koa-router")();
const userService = require("../config/mysqlConfig");
const bufferToBase64 = require("../utils/bufferToBase64");
router.prefix("/users");

//获取所有用户(GET请求)
router.get("/", async (ctx, next) => {
  let select = `select*from users`;
  const res = await userService.query(select);
  ctx.body = { code: 200, res, msg: "" };
});

//获取单个用户(GET请求)
router.get("/getOneInfo", async (ctx, next) => {
  const { account } = ctx.request.query;
  let select = `select*from users where account = '${account}'`;
  const res = (await userService.query(select))[0];
  let info = { ...res, avatar: bufferToBase64.bufferToBase64(res.avatar) };
  ctx.body = { code: 200, info, msg: "" };
});

// 更新当前用户信息(POST请求)
router.post("/updateUserInfo", async (ctx, next) => {
  let { account, userName, avatar } = ctx.request.body;
  let update = `update users set userName='${userName}',avatar='${avatar}' where account='${account}'`;
  await userService.query(update);
  ctx.body = { code: 200, msg: "更新成功" };
});
module.exports = router;
