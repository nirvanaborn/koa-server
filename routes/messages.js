const router = require("koa-router")();
const userService = require("../config/mysqlConfig");
const nanoid = require("nanoid");
const formatDate = require("../utils/formatDate");
router.prefix("/messages");

// 查询全部留言
// TODO 带条件查询
router.get("/getList", async (ctx, next) => {
  let select = `select*from messages order by submitDate`;
  const list = await userService.query(select);
  ctx.body = { code: 200, list, msg: "查询成功" };
});

// 提交留言(POST请求)
router.post("/submitMessage", async (ctx, next) => {
  let { message, account } = ctx.request.body;
  let insert = `insert into messages(id,message,account,submitDate) values ('${nanoid.nanoid(
    10
  )}','${message}','${account}','${formatDate.getFormatDate()}')`;
  await userService.query(insert);
  ctx.body = { code: 200, msg: "提交成功" };
});

module.exports = router;
