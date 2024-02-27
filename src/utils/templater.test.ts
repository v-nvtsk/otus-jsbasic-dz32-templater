import { template } from "./templater";

describe("template", () => {
  const data = {
    NAME: "Bob",
    AGE: "18",
    TEAM: "Core",
    items: [
      { A: 1, B: 2 },
      { A: 11, B: 22 },
      { A: 111, B: 222 },
    ],
  };

  it("should be a function", () => {
    expect(template).toBeInstanceOf(Function);
  });

  describe("support basic data placing", () => {
    it("puts data into placeholders", () => {
      expect(template("Hi, {{NAME}}", data)).toBe("Hi, Bob");
    });

    it("puts empty string into placeholders if no data provided", () => {
      expect(template("Hi, {{NAME}} {{SURNAME}}", data)).toBe("Hi, Bob ");
    });

    it("replaces all placeholders", () => {
      expect(template("Hi, {{NAME}}. My name is {{NAME}} too", data)).toBe("Hi, Bob. My name is Bob too");
    });
  });

  describe("support nested data placing", () => {
    it("puts nested data into placeholders", () => {
      expect(template("Hi, {{obj.NAME}} {{SURNAME}}", { obj: { NAME: "Bob" }, SURNAME: "Marley" })).toBe(
        "Hi, Bob Marley",
      );
    });
    it("puts nested data into placeholders", () => {
      expect(template("Hi, {{obj.NAME}} {{obj.SURNAME}}", { obj: { NAME: "Bob", SURNAME: "Marley" } })).toBe(
        "Hi, Bob Marley",
      );
    });
    it("puts nested deeply data into placeholders", () => {
      expect(template("{{a.b.c}}", { a: { b: { c: 777 } } })).toBe("777");
    });
  });

  describe("support loops", () => {
    it("handles basic loops", () => {
      expect(template("{{for items as item}}{{AGE}},{{endfor}}", data)).toBe("18,18,18,");
    });

    it("handles basic loops", () => {
      expect(template("{{for items as item}}{{item.A}},{{endfor}}", data)).toBe("1,11,111,");
    });

    it("handles basic loops with nested data", () => {
      expect(template("{{for a as item}}{{item.b.c}}, {{endfor}}", { a: [{ b: { c: 111 } }, { b: { c: 777 } }] })).toBe(
        "111, 777, ",
      );
    });

    it("handles basic loops with mixed data", () => {
      expect(template("{{for items as item}}{{AGE}} - {{item.A}},{{endfor}}", data)).toBe("18 - 1,18 - 11,18 - 111,");
    });

    it("puts values from list elements inside loop", () => {
      expect(
        template(`{{NAME}}{{for items as item}}{{item.NAME}},{{endfor}}`, {
          NAME: "0 ",
          items: [{ NAME: "1" }, { NAME: "2" }],
        }),
      ).toBe("0 1,2,");
    });
  });

  describe("support conditionals", () => {
    it("should handle simple conditionals", () => {
      expect(template("{{if BOOL}}YES{{endif}}", { BOOL: true })).toBe("YES");
    });

    it("should handle not only boolean variables for conditionals", () => {
      expect(template("{{if BOOL}}YES{{endif}}", { BOOL: 1 })).toBe("YES");
    });

    it("should support loops variables", () => {
      expect(template("{{for items as item}}{{item.A}}{{if isNotLast}},{{endif}}{{endfor}}", data)).toBe("1,11,111");
    });
  });

  describe("final test", () => {
    it("should work", () => {
      const testData = {
        title: "Some Title",
        author: "Some Author",
        tags: [
          { id: 1, title: "tag1" },
          { id: 11, title: "tag2" },
          { id: 111, title: "tag3" },
        ],
      };

      const src = `
<h2>{{title}}</h2>
{{if author}}
<h3>{{author}}</h3>
{{endif}}
{{if missed}}
<h3>{{author}}</h3>
{{endif}}
<div class="tags>
{{for tags as item}}
<a class="tag" href="#tag{{item.id}}">{{item.title}}</a>
{{if isNotLast}},{{endif}}
{{endfor}}
</div>`;

      const result = `
<h2>Some Title</h2>

<h3>Some Author</h3>


<div class="tags>

<a class="tag" href="#tag1">tag1</a>
,

<a class="tag" href="#tag11">tag2</a>
,

<a class="tag" href="#tag111">tag3</a>


</div>`;

      expect(template(src, testData)).toBe(result);
    });
  });

  describe("should handle empty data object", () => {
    it("should work", () => {
      const src = `
<h2>{{title.name}}</h2>
{{if author}}
<h3>{{author}}</h3>
{{endif}}
<div class="tags>
{{for tags as item}}
<a class="tag" href="#tag{{item.id}}">{{item.title}}</a>
{{if isNotLast}},{{endif}}
{{endfor}}
</div>`;
      const result = `
<h2></h2>

<div class="tags>

</div>`;

      expect(template(src, {})).toBe(result);
    });
  });
});
