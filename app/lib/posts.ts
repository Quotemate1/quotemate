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
    slug: 'how-to-price-a-tradie-job-australia',
    title: 'How to Price a Tradie Job in Australia (2026 Pricing Guide)',
    description: 'A practical framework for pricing any tradie job — labour rates, material markup, callout fees, and the mistakes that quietly kill your margin.',
    date: '2026-07-16',
    readTime: '7 min read',
    content: `
## Why "gut feel" pricing is costing you money

Most tradies price jobs the same way: think about what feels fair, round it to a nice number, and send it. The problem is "feels fair" doesn't account for your actual costs — and it's almost always biased toward undercharging, because nobody likes saying a big number out loud to a customer's face.

A proper price is built from numbers, not vibes. Here's the framework professional tradies actually use.

## Step 1: Work out your real hourly rate

Most tradies price labour based on what competitors charge. That's backwards. Start with what YOU need to earn.

**The formula:**

\`\`\`
(Target annual income + business overheads) ÷ billable hours per year = your hourly rate
\`\`\`

Say you want to earn $100,000 a year, and overheads (insurance, ute, tools, phone, accounting, rego) run another $25,000. That's $125,000 you need to bring in.

Now the part everyone gets wrong: **billable hours are not the same as working hours**. Between driving, quoting, admin, sick days, and slow weeks, most solo tradies only bill 1,000–1,200 hours a year — not the 2,000 you'd get from 40 hours × 50 weeks.

$125,000 ÷ 1,100 billable hours = **$113/hour**, just to hit your target. That's before profit margin.

## Step 2: Add material markup, don't just pass through cost

If you buy materials at trade price and charge the customer the exact same price, you're doing unpaid admin work — sourcing, transporting, and warehousing materials for free.

Standard practice across most trades is a **15–25% markup on materials**. Higher for small, fiddly items you had to make a special trip for; lower for big-ticket items where the raw dollar markup is already substantial.

## Step 3: Set a callout or minimum job fee

Every job has fixed costs before you even pick up a tool: driving time, fuel, and the opportunity cost of not being on a bigger job. A callout fee (commonly $80–$150 depending on your area) or a minimum job charge protects you from small jobs quietly losing money.

## Step 4: Build in a contingency, not just for materials — for scope creep

Ask any tradie what kills margin and they won't say materials — they'll say **scope creep**. "While you're here, can you also..." The fix isn't refusing extra work, it's pricing for the likelihood of it upfront: add 10–15% contingency to jobs with any uncertainty (old houses, jobs without full specs, anything sight-unseen).

## Step 5: Check your price against the local market — but don't anchor to it

Once you've built your price from the bottom up, sanity-check it against 2–3 competitor quotes if you can get them. If you're wildly higher, check whether you're overspecifying (better materials/warranty than asked for — fine, just say so) or under-costing your time. If you're wildly lower, you're probably about to work for free.

Rates also vary a lot by region — a Sydney or Melbourne CBD job supports a higher rate than a regional town, because your overheads (rent, insurance, cost of living) are higher too.

## The pricing mistakes that quietly kill tradie margins

**Charging by the job when the job is unpredictable.** Fixed-price is great when the scope is well understood (installing a fixed unit). It's dangerous on anything with unknowns (rewiring an old house, ripping out and finding rot). When in doubt, quote a range or add a documented contingency clause.

**Forgetting your own admin time.** Writing the quote, chasing payment, and doing the books all cost time. If you're not pricing for it, you're doing 5–10 hours a week of unpaid work.

**Never revisiting old rates.** Materials and insurance costs move constantly. A rate you set two years ago is probably underpriced today. Review your hourly rate at least once a year.

**Discounting instead of re-scoping.** If a customer says your price is too high, the fix usually isn't a discount — it's removing scope ("we can do a cheaper unit" or "you supply the fixtures, we supply labour"). Discounting straight off your price trains customers to always ask for one.

## Turning your price into a quote that wins the job

Once you know your number, how you present it matters almost as much as the number itself — see our guide on [how to write a tradie quote that actually wins jobs](/blog/how-to-write-tradie-quote) for the exact structure.

## Make the maths automatic

[SmokoHQ](/) handles the itemisation, GST, and formatting automatically once you've got your rate — you just plug in the job details and it writes a professional quote in 60 seconds. Try it free.

## The bottom line

Pricing isn't guessing, and it isn't copying whatever the tradie down the road charges. It's your real hourly rate, plus honest material markup, plus a buffer for the unpredictable stuff. Get the framework right once, and every future quote gets faster and more accurate.
    `
  },
  {
    slug: 'tradie-invoice-template-australia',
    title: 'Tradie Invoice Template Australia: What Every Invoice Needs (Free Example)',
    description: 'The exact fields the ATO and your customers expect on a tradie invoice, plus common invoicing mistakes that delay payment.',
    date: '2026-07-15',
    readTime: '5 min read',
    content: `
## Quote vs invoice: what's the difference?

A **quote** is an offer — what the job will cost if the customer says yes. An **invoice** is the bill you send once the work's done (or as a deposit request), asking to actually be paid. They look similar, but an invoice has stricter legal requirements, especially if you're GST-registered.

## What the ATO requires on a tax invoice

If you're registered for GST, any invoice over $82.50 (including GST) must be a **tax invoice**, and it legally needs:

1. The words "**Tax Invoice**" stated clearly
2. Your **identity** — business name and **ABN**
3. The **date** the invoice was issued
4. A brief **description** of the goods or services supplied
5. The **GST amount** payable — or a statement that the total price includes GST
6. The **total amount** payable

If you're invoicing a business customer for more than $1,000, you also need to include *their* identity or ABN.

None of this is optional if you're GST-registered — get it wrong and your customer's accountant may bounce the invoice back to you, delaying payment.

## What to include beyond the legal minimum

The legal requirements are the floor, not the ceiling. A genuinely professional invoice also includes:

- **Itemised line items** — labour and materials broken out separately, not lumped into one number. Customers pay faster when they can see exactly what they're paying for.
- **Payment terms** — due date, and accepted payment methods (bank transfer, card). "Due on receipt" or "Net 7 days" is standard for trade work; avoid vague terms like "ASAP."
- **Bank details** — BSB and account number front and centre. Every extra click a customer has to make to pay you is a delay.
- **Invoice number** — sequential numbering (INV-0001, INV-0002...) makes your books far easier at tax time and looks more professional than a one-off document.
- **A late payment clause** — even a simple line like "A 1.5% monthly fee applies to overdue invoices" meaningfully improves on-time payment rates, even if you never actually enforce it.

## The invoicing mistakes that delay payment

**Sending it too late.** Every day between finishing the job and sending the invoice is a day the customer's enthusiasm (and memory of why they needed you) fades. Invoice same-day or next-day, always.

**No clear due date.** "Please pay soon" isn't a due date. Put an actual date on it.

**Making customers hunt for how to pay.** If your bank details are buried in a footer, or you're asking people to call you for payment info, you're adding friction. Put them in the main body.

**Never following up.** Most overdue invoices aren't a customer refusing to pay — they've just forgotten. A polite reminder at 3–5 days overdue collects the large majority of late payments without any awkwardness.

## From quote to invoice in one step

If you already sent a professional quote, invoicing should just be converting that same document once the job's done — not starting from scratch. [SmokoHQ](/) auto-generates tax-invoice-ready invoices with your ABN, itemisation, and GST handled automatically, and can convert an accepted quote straight into an invoice. Try it free.

## The bottom line

An invoice that's clear, itemised, and easy to pay gets paid faster than one that's technically correct but a hassle to act on. Nail the ATO requirements first, then optimise for how quickly a busy customer can click "pay."
    `
  },
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