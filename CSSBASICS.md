## CSS(Cascading Style Sheets) Basics

#### CSS Inheritance

- CSS inheritance refers to the relationship between HTML tags (think parent and children tags) and how certain CSS styles can apply to a tag even though there aren't any CSS rules directly applied to it.
- Some CSS property values set on parent elements are inherited by their child elements, and some aren't.
- For example, if you set a color and font-family on an element, every element inside it will also be styled with that color and font, unless you've applied different color and font values directly to them
- Some properties do not inherit — for example, if you set a width of 50% on an element, all of its descendants do not get a width of 50% of their parent's width.
- The CSS shorthand property `all` can be used to apply one of these inheritance values to (almost) all properties at once. Its value can be any one of the inheritance values (inherit, initial, unsetor revert). It's a convenient way to undo changes made to styles so that you can get back to a known starting point before beginning new changes.

```css
.fix-this {
  all: unset;
}
```

#### CSS Cascading

- Cascading refers to the fact that cumulative styles across multiple CSS rules are applied to each and every HTML tag.
- The cascade, and the closely-related concept of specificity, are mechanisms that control which rule applies when there are conflicting rules applied to same element.
- Cascade simply means that the order of CSS rules matters; when two rules apply that have equal specificity, the one that comes last in the CSS is the one that will be used.

#### CSS Specificity

- Specificity is how the browser decides which rule applies if multiple rules have different selectors, but could still apply to the same element.
- For example an Element Selector is less specific than a Class selector.
- The rule with `higher` specificity gets applied even though there our other rules down the file that also target the same element.
- InLine styles have highest specificity.
- `Source order < Specificity < Important Tag`.
- Only the properties which are the same are overwritten.
- `The universal selector (*), combinators (+, >, ~, ' '), and negation pseudo-class (:not) have no effect on specificity.`
- [Selector reference documents](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)

#### Box Model

- Everything in CSS has a box around it, and understanding these boxes is key to being able to create layouts with CSS, or to align items with other items.
- When laying out a document, the browser's rendering engine represents each element as a rectangular box according to the standard CSS basic box model. CSS determines the size, position, and properties (color, background, border size, etc.) of these boxes.
- Every box is composed of four parts (or areas), defined by their respective edges: the content edge, padding edge, border edge, and margin edge.
- In CSS we broadly have two types of boxes — `block boxes and inline boxes`.
- These characteristics refer to how the box behaves in terms of page flow and in relation to other boxes on the page.
- If a box has an outer display type of `block`, it will behave in the following ways:
  - The box will break onto a new line.
  - The box will extend in the inline direction to fill the space available in most cases box will become as wide as its container, filling up 100% of the space available.
  - The width and height properties are respected.
  - Padding, margin and border will cause other elements to be pushed away from the box
  - Some example are <h1>, <p>, <div> use block
- If a box has an outer display type of `inline`, then:
  - The box will not break onto a new line.
  - The width and height properties will not apply.
  - Vertical padding, margins, and borders will apply but will not cause other inline boxes to move away from the box.
  - Horizontal padding, margins, and borders will apply and will cause other inline boxes to move away from the box.
  - Some HTML elements, such as <a>, <span>, <em> and <strong> use inline as their outer display type by default.
- Boxes also have an inner display type, however, which dictates how elements inside that box are laid out. By default, the elements inside a box are laid out in normal flow, which means that they behave just like any other block and inline elements
- If we set display: flex; on an element, the outer display type is block, but the inner display type is changed to flex
- Making up a block box in CSS we have the:

  - `Content box`: The area where your content is displayed, which can be sized using properties like width and height.
  - `Padding box`: The padding sits around the content as white space; its size can be controlled using padding and related properties.
  - `Border box`: The border box wraps the content and any padding. Its size and style can be controlled using border and related properties.
  - `Margin box`: The margin is the outermost layer, wrapping the content, padding, and border as whitespace between this box and other elements. Its size can be controlled using margin and related properties.

  `In the standard box model, if you give a box a width and a height attribute, this defines the width and height of the content box. Any padding and border is then added to that width and height to get the total size taken up by the box.`

  `In an alternative box model , any width is the width of the visible box on the page, therefore the content area width is that width minus the width for the padding and border`

- We get the alternate css box model by setting the `box-sizing` property
  ```css
  box-sizing: border-box;
  ```

#### Margin collapsing

If you have two elements whose margins touch, and both margins are positive, those margins will combine to become one margin, and its size will be equal to the largest individual margin. If one margin is negative, its value will be subtracted from the total. Where both are negative, the margins will collapse and the smallest (furthest from zero) value will be used.

`example - The top paragraph has a margin-bottom of 50 pixels. The second paragraph has a margin-top of 30 pixels. The margins have collapsed together so the actual margin between the boxes is 50 pixels and not the total of the two margins.`

#### Units

- The `em` unit means "my parent element's font-size". They get compounded, if there is nesting.
- The `rem` unit means "The root element's font-size". This means that each successive level of nesting does not keep getting larger.
- The thing with `percentage` is that they are always set relative to some other value (generally the parent)

##### Generating content with ::before and ::after

- There are a couple of special pseudo-elements, which are used along with the content property to insert content into your document using CSS.

Output - `Hello World`

```html
<p class="box">World</p>
```

```css
.box::before {
  content: "Hello";
}
```

- Inserting strings of text from CSS isn't really something we do very often on the web however, as that text is inaccessible to some screen readers and might be hard for someone to find and edit in the future.
- A more valid use of these pseudo-elements is to insert an icon or are also frequently used to insert an empty string, which can then be styled just like any element on the page.
  ```css
  .box::before {
    content: "";
    display: block;
    width: 100px;
    height: 100px;
    background-color: rebeccapurple;
    border: 1px solid black;
  }
  ```
