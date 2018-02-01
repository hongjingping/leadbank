module.exports = {
  "root" : true,
  "parserOptions": { 
    "parser": 'babel-eslint',
    "ecmaVersion": 8,
    "sourceType": "module",
  },
  "env": {
    "browser": true
  },
  "extends": [
    'standard',
    'plugin:vue/recommended'
  ],
  "plugins": [
    // "vuefix",
    "vue"
  ],
  "rules": {
    // 控制语句不能省略花括号
    "curly": 1,
    // 不能有空的函数
    "no-empty-function": 1,
    // 与null比较时必须使用 === or !==
    "no-eq-null": 1,
    // 禁止使用eveal解析
    "no-implied-eval": 1,
    // 小数点之前或之后必须有一个数字
    "no-floating-decimal": 1,
    // 禁止全局命名变量和函数
    "no-implicit-globals": 1,
    // 数组括号内必须换行
    "array-bracket-newline": ["warn", { "minItems": 2 }],
    // 一行代码中使用同样的规则
    "block-spacing": ["warn","always"],
    // 大括号使用一致的风格 Stroustrup
    "brace-style": ["warn"],
    // 使用一致的缩进 
    "indent": ["warn", 2,{ "VariableDeclarator": 1 }],
    // 禁止使用 空格 和 tab 混合缩进
    "no-mixed-spaces-and-tabs": 1,
    // 强制使用一致的反勾号、双引号或单引号
    "quotes": ["warn"],
    // 禁止未使用过的变量
    "no-unused-vars": ["warn"],
    // 要求使用骆驼拼写法
    "camelcase": ["warn"],
    // 要求使用 === 和 !==
    "eqeqeq": 0,
    // 此规则可帮助你定位由变量漏写、参数名漏写和意外的隐式全局变量声明所导致的潜在引用错误
    "no-undef": ["warn"],
    // 该规则强制对象属性的冒号左右的空格的一致性。它可以单独验证每一个属性，或它可以确保对象中的属性在垂直方向上对齐。
    "key-spacing": ["warn"],
    // 要求或禁止使用拖尾逗号
    "comma-dangle": ["warn"],
    // 在非空文件中存在拖尾换行是一个常见的 UNIX 风格。它的好处同输出文件到终端一样，方便在串联和追加文件时不会打断 shell 的提示。
    "eol-last": ["warn"],
    // 禁用行尾空白  有时在编辑文件的过程中，你可以在行的末尾以额外的空格作为结束。这些空格差异可以被源码控制系统识别出并被标记为差异，给开发人员带来挫败感。虽然这种额外的空格并不会造成功能性的问题，许多编码规范要求在提交代码之前删除尾部空格。
    "no-trailing-spaces": ["warn"],
    // 禁止使用 Array 构造函数
    "no-array-constructor": ["warn"],
    // 在一个方法中应该允许多少个变量声明。
    "one-var": ["warn","never"],
    // 禁止重新声明变量
    "no-redeclare": ["warn"],
    // 禁止未使用过的表达式 
    "no-unused-expressions": ["warn"],
    // 不允许使用逗号操作符
    "no-sequences": ["error"],
    // 禁止在嵌套的语句块中出现变量或 function 声明 
    "no-inner-declarations": ["warn"],
    // 禁止扩展原生对象
    "no-extend-native": ["warn"],
    // 要求在语句末尾使用分号
    "semi": ["warn", "always"],
    // 强制在逗号周围使用空格
    "comma-spacing": ["warn"],
    // 要求或禁止函数圆括号之前有一个空格
    "space-before-function-paren": ["warn"],
    // 禁止对 function 声明重新赋值
    "no-func-assign": ["warn"],
    // 这个规则在文件内的任何地方寻找制表符：代码，注释或其他东西
    "no-tabs": ["warn"],
    // 空白对于分离代码代码段逻辑是有帮助的，但过量的空白会占用更多的屏幕 默认最大连续空2行
    "no-multiple-empty-lines": ["warn"],
    // 此规则在对象文字的大括号，解构赋值和导入/导出说明符中强制执行一致的间距。
    "object-curly-spacing": ["warn"],
    "standard/object-curly-even-spacing": ["warn"],
    // 此规则的目的在于标记出可以被正常函数调用所替代的 Function.prototype.call() 和 Function.prototype.apply() 的使用。
    "no-useless-call": ["warn"],
    // 禁止在对象字面量中出现重复的键
    "no-dupe-keys": ["warn"],
    // 禁用不必要的转义
    "no-useless-escape": ["warn"],
    "no-new": 0,
    // 要求构造函数首字母大写
    "new-cap": ["Warn"],
    // 禁止在条件语句中出现赋值操作符
    "no-cond-assign": ["warn"],
    // 禁止在条件中使用常量表达式
    "no-constant-condition": ["warn"],
    // 禁止出现多个空格  在某行中，出现多个空格而且不是用来作缩进的，通常是个错误
    "no-multi-spaces": ["warn"],
    // 要求或禁止块内填充 一些风格指南要求块语句以空行开始并且以空行结束。目标是通过块内容和周围代码视觉上地分离来提高可读性
    "padded-blocks": ["warn"],
    // 要求或禁止语句块之前的空格
    "space-before-blocks": ["warn"],
    // 强制关键字周围空格的一致性
    "keyword-spacing": ["warn"],
    // 禁止或强制圆括号内的空格
    "space-in-parens": ["warn"],
    // 要求中缀操作符周围有空格 
    "space-infix-ops": ["warn"],
    // .vue文件规则
    // 限制每行属性/属性的最大数量以提高可读性。
    "vue/max-attributes-per-line": ["warn",{"multiline": {'allowFirstLine': true}}],
    // 自闭很简单，但是在原始HTML中不支持。这个规则可以帮助你统一自闭风格。
    "vue/html-self-closing": ["warn",{
        "html": {
           "normal": "never" 
        }
    }],
    // 属性绑定的形式 v-bind 还是： 默认：
    "vue/v-bind-style": ['warn'],
    // 导出name的写法统一  默认采用驼峰写法
    "vue/name-property-casing": ["warn"],
    // 组件中声明的属性顺序
    "vue/order-in-components": ["warn"],
    // HTML缩进规则 默认2个空格
    "vue/html-indent": ["warn"],
    // 报告有v-for和没有的元素v-bind:key
    "vue/require-v-for-key": ["warn"],
    // 统一内插槽的统一间距
    "vue/mustache-interpolation-spacing": ["warn"],
    // 在模板中强制实现属性命名风格  使用驼峰命名 除data-和aria-
    "vue/attribute-hyphenation": ["warn","never"],
    // 禁止v-for指令或范围属性的未使用的变量定义
    "vue/no-unused-vars": ["warn"],
    // 如果此规则与配置的引号不同，则会报告属性的引用。 默认双引号
    "vue/html-quotes": ["warn"],
    // 这个规则的目的是消除不用于缩进的属性之间的连续多个空格
    "vue/no-multi-spaces": ["warn"],
    // 组件定义prop应该详细  至少指定类型
    "vue/require-prop-types": ["error"],
    // 报告指令或mustaches的语法错误
    "vue/no-parsing-error": ["warn"],
    // 这个规则检查每个v-on指令是否有效。
    "vue/valid-v-on": ["warn"],
    // 此规则要求为每个未标记的道具设置默认值required。
    "vue/require-default-prop": ["warn"],
    // v-for优先级高于v-if。这意味着v-if将分别在循环的每个迭代上运行。 所以当它们存在于同一个节点上时，v-if指令应该使用由v-for指令定义的变量的引用。
    "vue/no-confusing-v-for-v-if": ["warn"],
    // html标签闭合
    "vue/html-end-tags": ["warn"],
    // 此规则防止使用重复的名称。
    "no-dupe-keys": ["error"]
  }
};