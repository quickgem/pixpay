function GET_MULTI_TEXT(str) {
    if (!str) return "";
    let ret = Tos.SysGetString(str);
    console.log("GET_Multi_TEXT 0000========> ", ret ? ret.code : "", ret ? ret.data : "");
    if (!ret || ret.code !== 0 || !ret.data) return "";
    return ret.data;
}
exports.GET_MULTI_TEXT = GET_MULTI_TEXT;