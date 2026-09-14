// Fix Express 4 content-type charset lookup across all nested Express instances in monorepo
const patchExpress = (exp: any) => {
  if (exp && exp.response) {
    const mimeTypes = require('mime-types');
    const origSet = exp.response.set;
    exp.response.set = exp.response.header = function (this: any, field: any, val: any) {
      if (arguments.length === 2) {
        let value: any = Array.isArray(val) ? val.map(String) : String(val);
        if (typeof field === 'string' && field.toLowerCase() === 'content-type') {
          const strVal = String(value);
          if (!/;\s*charset\s*=/i.test(strVal)) {
            const charset = mimeTypes.charset ? mimeTypes.charset(strVal.split(';')[0]) : 'utf-8';
            if (charset) {
              value = strVal + '; charset=' + String(charset).toLowerCase();
            }
          }
          return this.setHeader(field, value);
        }
      }
      return origSet.apply(this, arguments);
    };
  }
};

try {
  patchExpress(require('express'));
} catch (e) {}

try {
  patchExpress(require('@nestjs/platform-express/node_modules/express'));
} catch (e) {}
