export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  content: string
}

export const POSTS: BlogPost[] = [
  {
    slug: 'how-to-write-tradie-quote',
    title: 'How to Write a Tradie Quote That Actually Wins Jobs',
    description: 'The exact structure professional Aussie tradies use to write quotes that customers actually accept. Includes free template.',
    date: '2026-05-12',
    readTime: '6 min read',
    content: `
## Why most tradie quotes lose jobs

Most tradies lose jobs not because their pricing is wrong, but because their quote is rushed, unclear, or unprofessional. A customer with three quotes in front of them will almost always pick the one that looks the most legitimate — even if it's not the cheapest.

Here's the simple truth: **the quote IS your sales pitch**. If you treat it like a chore, you'll lose work to tradies who treat it like a craft.

## The 7 things every winning tradie quote needs

### 1. Your business header

Looks obvious, but heaps of tradies skip it. Put your **business name**, **ABN**, **phone**, **email**, and ideally a **logo** at the top. This isn't optional — customers judge legitimacy in 3 seconds.

### 2. A personalised greeting

Don't just write "Quote for: John". Write a single line that shows you actually listened during the site visit. Something like:

> "G'day John, thanks for the chat on Tuesday. Here's the detailed quote for the hot water service replacement we discussed."

That one line beats 90% of competitor quotes.

### 3. A clear scope of work

This is where most tradies lose jobs. Don't write "Replace hot water system". Write what you'll actually do, in plain English:

> "Remove existing 250L electric hot water system. Supply and install new Rinnai 26L continuous flow gas system. Includes new copper pipework, gas conversion (where required), and disposal of old unit."

Specificity wins. Vagueness loses.

### 4. What's included AND excluded

This is the secret weapon. Most quotes only list what's included. Smart tradies list what's NOT included (e.g. "Excludes any electrical work beyond connection point"). This protects you from scope creep AND signals professionalism.

### 5. Itemised pricing with GST

Australian customers expect this. Don't lump it all together — break out each line item, show subtotal, GST (10%), and total. Hiding the GST or just writing "All inclusive" makes you look dodgy.

### 6. Terms and conditions

Include payment terms (e.g. "50% deposit, balance on completion"), warranty info, and what happens if the scope changes. One paragraph is enough. It massively reduces disputes later.

### 7. Validity period

"Quote valid for 30 days from date issued." This protects you from price rises on materials and gives the customer a soft deadline.

## The follow-up nobody does

Here's the brutal truth: **80% of jobs go to whoever follows up first**. Send a quote, wait 48 hours, and if you haven't heard back, send a polite follow-up like:

> "Hey John, just checking in on the quote I sent through Tuesday for the hot water system. Happy to answer any questions or come back out if you'd like to chat through it. Let me know either way!"

That single message wins more jobs than any pricing change ever will. (This is exactly what SmokoHQ does automatically, but you can do it manually too.)

## Free tradie quote template

Want to skip the typing? [SmokoHQ](/) auto-generates professional quotes in 60 seconds using AI — including all 7 of the above. Or grab any free template online and customise it to include the above sections.

## The bottom line

Quoting isn't admin. It's sales. The tradies winning the most work in Australia right now aren't necessarily the cheapest — they're the ones whose quotes look like they know what they're doing.

Spend 5 extra minutes on every quote. Watch your conversion rate double.
    `
  },
  {
    slug: 'gst-on-tradie-quotes-australia',
    title: 'GST on Tradie Quotes Explained (Australia 2026)',
    description: 'Everything Aussie tradies need to know about GST on quotes and invoices. When it applies, how to calculate it, and how to display it properly.',
    date: '2026-05-11',
    readTime: '4 min read',
    content: `
## Do you charge GST on tradie quotes?

If your business turns over **$75,000 or more per year**, you must register for GST and charge it on every quote and invoice. This isn't optional — it's an ATO requirement.

If you're under $75k, registration is optional. But many tradies register anyway because:
- It looks more professional
- You can claim GST back on tools and materials
- Bigger customers (builders, councils) usually require GST-registered contractors

## How to calculate GST on a quote

Australian GST is **10%**. So if your labour and materials add up to $1,000, you add $100 GST, and the total is $1,100.

The standard quote breakdown looks like this:

**Subtotal**: $1,000.00
**GST (10%)**: $100.00
**Total**: $1,100.00

## How to display GST on a quote (the right way)

Your quote should always show:

1. **Subtotal** (your price excluding GST)
2. **GST amount** (10% of subtotal)
3. **Total including GST**
4. Your **ABN** prominently at the top

If your prices are GST-inclusive, write "All prices include GST" clearly. Don't make customers do the maths — it creates disputes.

## Common GST mistakes tradies make

### Mistake 1: Quoting GST-inclusive without saying so

If you write "$5,500 to repaint the deck" without specifying, the customer assumes that's the total. If you later try to add GST, you'll lose the job (or eat the cost).

### Mistake 2: Forgetting GST on materials passed through

If you buy $500 of paint and charge it to the customer, you still charge GST on that $500. The fact that you already paid GST when buying it doesn't change what you charge the customer. You claim back what you paid as a business expense.

### Mistake 3: Not registering when required

The $75k threshold is **cumulative across a rolling 12-month period**, not financial year. If you hit it mid-year, you need to register within 21 days. Penalties for late registration are nasty.

## Tax invoice vs quote

A **quote** is an offer. A **tax invoice** is what you send AFTER the job to collect payment. Tax invoices have stricter requirements:

- The words "Tax Invoice"
- Your ABN
- Date of issue
- Description of goods/services
- GST amount (or statement that it's GST-inclusive)
- Total amount

For quotes, the requirements are looser — but including all of the above future-proofs your quotes when they convert to invoices.

## Make GST handling automatic

[SmokoHQ](/) automatically calculates and displays GST on every quote, with your ABN at the top. No maths, no formatting headaches. Try it free.

## Got specific GST questions?

If your situation is unusual (margin scheme, going concern, partial registration), talk to a registered tax agent. The ATO website also has solid resources at [ato.gov.au/gst](https://www.ato.gov.au/business/gst/).

The 10% rule covers 95% of tradie situations. Get that right, and you're sorted.
    `
  }
]