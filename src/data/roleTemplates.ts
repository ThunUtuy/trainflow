import { ShieldCheck, Shirt, Workflow, UtensilsCrossed, ChefHat, Coffee } from "lucide-react";

export interface TemplatePage {
  type: "text" | "checklist";
  title: string;
  content: { text?: string; items?: string[] };
}

export interface TemplateQuiz {
  title: string;
  questions: {
    question_text: string;
    type: "single_choice" | "multi_choice" | "true_false";
    options: string[];
    correct_answers: number[];
  }[];
}

export interface TemplateModule {
  title: string;
  description: string;
  pages: TemplatePage[];
  quiz: TemplateQuiz;
}

export interface RoleTemplate {
  key: string;
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  modules: TemplateModule[];
}

export const roleTemplates: RoleTemplate[] = [
  {
    key: "foh",
    icon: UtensilsCrossed,
    title: "Restaurant Front of House",
    description: "Complete training for servers, hosts, and FOH staff",
    modules: [
      {
        title: "Dress Code & Personal Hygiene",
        description: "Uniform standards, grooming, and hygiene expectations for guest-facing staff",
        pages: [
          {
            type: "text",
            title: "Uniform Standards",
            content: {
              text: "As a front-of-house team member, you represent the restaurant to every guest. Your appearance sets the tone before you even speak.\n\n• Wear the provided uniform — clean, pressed, and in good condition at all times.\n• Name badge must be visible and worn on the left side of your chest.\n• Closed-toe, non-slip black shoes are mandatory. No trainers, sandals, or open-toe shoes.\n• Aprons (if provided) should be clean and tied properly.\n• No excessive jewellery — one small pair of stud earrings and a plain wedding band are acceptable. No bracelets, dangling earrings, or visible piercings.\n• Tattoos should be covered where possible, per company policy."
            },
          },
          {
            type: "text",
            title: "Personal Hygiene",
            content: {
              text: "Hygiene is non-negotiable in hospitality. Guests notice, and health inspectors check.\n\n• Shower before every shift. Use deodorant but avoid strong perfumes or colognes — these can interfere with the dining experience.\n• Hair must be neat and tied back if shoulder-length or longer. Hair nets are required in food-prep areas.\n• Nails must be short, clean, and free of nail polish or acrylics (these can chip into food).\n• Wash hands thoroughly: before starting your shift, after using the toilet, after touching your face/hair, after handling cash, after clearing dirty plates, and after eating or drinking.\n• If you are ill (vomiting, diarrhoea, or fever), do not come to work. Notify your manager immediately. You must be symptom-free for 48 hours before returning."
            },
          },
          {
            type: "checklist",
            title: "Pre-Shift Appearance Check",
            content: {
              items: [
                "Clean, pressed uniform with no stains or tears",
                "Name badge visible on left chest",
                "Closed-toe non-slip black shoes",
                "Hair neat and tied back",
                "Nails short and clean, no polish",
                "Minimal jewellery only",
                "Deodorant applied, no strong fragrance",
                "Hands washed and sanitised",
              ],
            },
          },
        ],
        quiz: {
          title: "Dress Code & Hygiene Quiz",
          questions: [
            { question_text: "Which type of shoes must FOH staff wear?", type: "single_choice", options: ["White trainers", "Closed-toe non-slip black shoes", "Any comfortable shoes", "Open-toe sandals"], correct_answers: [1] },
            { question_text: "How long must you be symptom-free before returning to work after vomiting or diarrhoea?", type: "single_choice", options: ["12 hours", "24 hours", "48 hours", "72 hours"], correct_answers: [2] },
            { question_text: "Nail polish and acrylic nails are acceptable for front-of-house staff.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
            { question_text: "Which of these are times you must wash your hands?", type: "multi_choice", options: ["After handling cash", "After clearing dirty plates", "Before starting your shift", "Only at the end of your shift"], correct_answers: [0, 1, 2] },
          ],
        },
      },
      {
        title: "Customer Service Basics",
        description: "Core principles of hospitality service, guest interaction, and professionalism",
        pages: [
          {
            type: "text",
            title: "The Fundamentals of Great Service",
            content: {
              text: "Great service isn't about being perfect — it's about making every guest feel welcome, valued, and cared for.\n\n**The 10/5 Rule:**\n• At 10 feet: Make eye contact and smile at the guest.\n• At 5 feet: Greet them verbally with a warm welcome.\n\n**The 3 Pillars of Hospitality:**\n1. **Anticipation** — Notice what a guest needs before they ask. An empty glass? A dropped napkin? A confused look at the menu? Act before they flag you down.\n2. **Attentiveness** — Check in at the right moments: after drinks arrive, 2 minutes after food is served, and before dessert. Don't hover or interrupt.\n3. **Authenticity** — Be genuine. Guests can tell the difference between scripted friendliness and real warmth.\n\n**Body Language Matters:**\n• Stand up straight, keep hands visible (not in pockets).\n• Never lean on walls, furniture, or the POS station.\n• Approach tables from the side, not from behind guests.\n• Crouch slightly to be at eye level when taking orders at a table."
            },
          },
          {
            type: "text",
            title: "Communication & Upselling",
            content: {
              text: "**Speaking with Guests:**\n• Use positive language: say 'Absolutely!' instead of 'No problem.' Say 'Great choice!' instead of 'OK.'\n• Avoid jargon — guests don't know what '86'd' or 'in the weeds' means.\n• When you don't know the answer, say: 'Let me find out for you' — never guess.\n\n**Upselling (Done Right):**\nUpselling isn't pushy — it's about enhancing the guest experience.\n• Suggest specific items: 'Our sea bass is incredible tonight' beats 'Would you like a starter?'\n• Pair recommendations: 'That steak pairs beautifully with our Malbec.'\n• Timing matters: suggest starters when handing out menus, desserts after clearing mains, cocktails when taking drink orders.\n• Read the table — a quick business lunch doesn't want a full upsell pitch.\n\n**Allergies & Dietary Requirements:**\n• Always ask: 'Does anyone have any allergies or dietary requirements?'\n• If unsure about ingredients, check with the kitchen — never assume.\n• Common allergens: nuts, gluten, dairy, shellfish, eggs, soya, sesame."
            },
          },
          {
            type: "checklist",
            title: "Service Excellence Checklist",
            content: {
              items: [
                "Greet every guest within 30 seconds of seating",
                "Make eye contact and smile when approaching",
                "Ask about allergies and dietary requirements",
                "Repeat orders back to confirm accuracy",
                "Check in after drinks arrive and 2 minutes after food",
                "Never say 'no' — offer alternatives instead",
                "Thank guests sincerely when they leave",
                "Clear plates from the right, serve from the left",
              ],
            },
          },
        ],
        quiz: {
          title: "Customer Service Quiz",
          questions: [
            { question_text: "In the 10/5 Rule, what should you do when a guest is 10 feet away?", type: "single_choice", options: ["Greet them verbally", "Make eye contact and smile", "Take their order", "Ignore them until they sit down"], correct_answers: [1] },
            { question_text: "When is the best time to check in after food has been served?", type: "single_choice", options: ["Immediately", "After 2 minutes", "After 10 minutes", "Only if they flag you down"], correct_answers: [1] },
            { question_text: "Which of these are common allergens you should be aware of?", type: "multi_choice", options: ["Nuts", "Gluten", "Shellfish", "Water"], correct_answers: [0, 1, 2] },
            { question_text: "It's OK to guess about ingredients if you're fairly sure.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Greeting & Seating Guests",
        description: "Host duties, reservation management, and first impressions",
        pages: [
          {
            type: "text",
            title: "The Art of the Welcome",
            content: {
              text: "The first 30 seconds determine a guest's entire impression of the restaurant.\n\n**When Guests Arrive:**\n1. Acknowledge them immediately — even if you're busy, make eye contact, smile, and say: 'Welcome! I'll be right with you.'\n2. Ask: 'Do you have a reservation?' If yes, confirm the name, party size, and any notes (birthday, anniversary, high chair needed).\n3. If no reservation: check availability, give an honest wait time if there's a wait, and offer the bar area.\n\n**Seating:**\n• Lead guests to their table — walk at their pace, don't rush.\n• Pull out chairs if appropriate (especially for elderly guests or those with children).\n• Present menus and say: 'Your server today is [Name], they'll be right with you.'\n• For parties with children: offer high chairs and kids' menus proactively.\n\n**Managing the Wait:**\n• If there's a wait, offer a specific time: '15 minutes' is better than 'shouldn't be too long.'\n• Take their name and mobile number. Text or find them when their table is ready.\n• Offer menus to browse while waiting."
            },
          },
          {
            type: "text",
            title: "Reservation Management",
            content: {
              text: "**Key Principles:**\n• Check the reservation book (or system) at the start of every shift. Know who's coming, when, and any special requests.\n• VIP and regular guests should be flagged — greet them by name when possible.\n• Note allergies, celebrations, and seating preferences attached to reservations.\n\n**Table Allocation:**\n• Balance sections — don't overload one server while another stands idle.\n• Seat couples at 2-tops, larger groups at appropriate tables. Don't seat a couple at a 6-top during peak hours.\n• Keep accessible seating available for guests with mobility needs.\n• Window and 'best' tables should be rotated fairly among guests, not reserved only for regulars.\n\n**No-Shows & Late Arrivals:**\n• Hold reserved tables for 15 minutes past the booking time (or per house policy).\n• After the hold time, attempt to contact the guest before releasing the table.\n• Log no-shows for future reference."
            },
          },
          {
            type: "checklist",
            title: "Host Station Checklist",
            content: {
              items: [
                "Review all reservations for the shift",
                "Note special requests and VIP guests",
                "Ensure host station is clean and menus are stocked",
                "Check table layout and available sections",
                "Coordinate with servers on section assignments",
                "Greet every guest within 10 seconds of entering",
              ],
            },
          },
        ],
        quiz: {
          title: "Greeting & Seating Quiz",
          questions: [
            { question_text: "How long should you hold a reserved table past the booking time before attempting to contact the guest?", type: "single_choice", options: ["5 minutes", "15 minutes", "30 minutes", "1 hour"], correct_answers: [1] },
            { question_text: "You should seat a couple at a 6-person table during peak hours if it's the only one available.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
            { question_text: "What should you do if the restaurant is full and guests arrive without a reservation?", type: "single_choice", options: ["Tell them to come back tomorrow", "Give an honest wait time and offer the bar area", "Seat them at a dirty table", "Ignore them"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Taking Orders & Menu Knowledge",
        description: "Order-taking procedures, menu familiarity, and accuracy",
        pages: [
          {
            type: "text",
            title: "Menu Knowledge",
            content: {
              text: "You can't sell what you don't know. Every FOH team member should know the menu inside out.\n\n**What You Must Know:**\n• Every dish name, what's in it, and how it's prepared.\n• Daily specials and any items that are 86'd (unavailable).\n• Allergen information for every dish. Your restaurant should have an allergen matrix — study it.\n• Which dishes are vegetarian, vegan, gluten-free, or can be modified.\n• Recommended pairings: wine, cocktails, or sides that complement mains.\n• Portion sizes — can a guest share? Is a dish light or heavy?\n\n**Tasting the Menu:**\n• If your restaurant offers staff tastings, attend every one. You sell better when you can say: 'I've tried it, it's incredible.'\n• If no tastings are offered, ask questions. Talk to the kitchen about flavour profiles, textures, and presentation.\n\n**Specials:**\n• Memorise the daily specials before service. Know the ingredients, preparation method, and price.\n• Deliver specials with enthusiasm — describe flavours, not just ingredients: 'a rich, slow-braised lamb shank with creamy mash' beats 'lamb with mash.'"
            },
          },
          {
            type: "text",
            title: "Taking Orders Accurately",
            content: {
              text: "**The Order-Taking Process:**\n1. Approach the table with a notepad (or tablet) and pen ready.\n2. Ask if guests are ready, or if they'd like more time. Don't rush them.\n3. Take orders clockwise around the table, starting with the guest at a designated seat number. This ensures food goes to the right person without asking 'Who had the fish?'\n4. Write everything down — even if you think you'll remember.\n5. Note modifications clearly: 'no onions,' 'dressing on the side,' 'well-done.'\n6. Read the order back: 'So that's the Caesar to start, followed by the ribeye medium-rare with fries — is that right?'\n7. Collect menus and enter the order into the POS promptly.\n\n**Seat Numbers:**\nMost restaurants use a seat numbering system. Seat 1 is usually the guest closest to a fixed reference point (like the door). Learn your restaurant's system — it prevents food mix-ups.\n\n**Firing Courses:**\n• If guests want starters and mains, the kitchen needs to know when to 'fire' (start cooking) the mains. Communicate timing clearly when entering the order.\n• Ask: 'Would you like your starters and mains together, or would you prefer a pause between courses?'"
            },
          },
          {
            type: "checklist",
            title: "Order-Taking Checklist",
            content: {
              items: [
                "Know today's specials and any 86'd items before service",
                "Ask about allergies and dietary requirements",
                "Take orders using seat numbers, clockwise",
                "Write down every order — don't rely on memory",
                "Note all modifications clearly",
                "Read back the full order to confirm",
                "Enter order into POS promptly after leaving the table",
                "Communicate course timing to the kitchen",
              ],
            },
          },
        ],
        quiz: {
          title: "Orders & Menu Knowledge Quiz",
          questions: [
            { question_text: "Why should you take orders using seat numbers?", type: "single_choice", options: ["It's faster", "So food goes to the right person without asking", "It's a legal requirement", "Guests prefer it"], correct_answers: [1] },
            { question_text: "You should always write down orders, even if you think you'll remember.", type: "true_false", options: ["True", "False"], correct_answers: [0] },
            { question_text: "What does '86'd' mean in restaurant terminology?", type: "single_choice", options: ["A table number", "An item is unavailable", "A reservation code", "A discount code"], correct_answers: [1] },
            { question_text: "Which of these should you know about every menu item?", type: "multi_choice", options: ["Ingredients and preparation method", "Allergen information", "The supplier's name", "Recommended pairings"], correct_answers: [0, 1, 3] },
          ],
        },
      },
      {
        title: "Handling Complaints & Difficult Situations",
        description: "De-escalation techniques, complaint resolution, and recovery",
        pages: [
          {
            type: "text",
            title: "The LAST Framework for Complaints",
            content: {
              text: "Complaints are opportunities. A well-handled complaint can turn a frustrated guest into a loyal regular. Use the LAST framework:\n\n**L — Listen**\n• Let the guest speak without interrupting. Give them your full attention.\n• Don't get defensive or make excuses.\n• Nod and maintain eye contact to show you're engaged.\n\n**A — Apologise**\n• A sincere apology goes a long way: 'I'm really sorry about that. That's not the experience we want for you.'\n• Don't blame others ('the kitchen messed up') — take ownership as a team.\n\n**S — Solve**\n• Offer a solution: 'Can I get that remade for you right away?' or 'Let me remove that from your bill.'\n• If you're unsure what to offer, ask: 'What can I do to make this right?'\n• If the issue is beyond your authority, involve a manager promptly — don't leave the guest waiting.\n\n**T — Thank**\n• Thank the guest for letting you know: 'Thank you for telling us — it helps us improve.'\n• Follow up later in the meal to ensure they're now happy."
            },
          },
          {
            type: "text",
            title: "Common Scenarios & Responses",
            content: {
              text: "**Long wait for food:**\n'I'm sorry for the delay. Let me check with the kitchen right now and get you an update.' — then follow through.\n\n**Wrong dish served:**\n'I apologise for the mix-up. Let me get the correct dish for you straight away. Can I get you a drink while you wait?'\n\n**Food quality complaint (cold food, undercooked, etc.):**\n'I'm sorry that's not right. I'll have the kitchen remake it immediately. Would you like the same dish or would you prefer something else?'\n\n**Bill dispute:**\nNever argue about money at the table. Say: 'Let me review this with my manager and we'll get it sorted for you.'\n\n**Intoxicated guests:**\n• You have a legal responsibility not to serve alcohol to visibly intoxicated guests.\n• Speak calmly and discreetly: 'I'd be happy to get you some water or a soft drink.'\n• If they become aggressive, alert your manager immediately. Do not confront them alone.\n\n**Allergic reaction:**\nThis is a medical emergency. Alert the manager immediately. Call 999/112/911 if the reaction is severe. Do not move the guest unless necessary."
            },
          },
          {
            type: "checklist",
            title: "Complaint Resolution Checklist",
            content: {
              items: [
                "Listen fully without interrupting",
                "Apologise sincerely — don't blame others",
                "Offer a specific solution",
                "Involve a manager if needed",
                "Follow up with the guest before they leave",
                "Log the complaint for the team to review",
              ],
            },
          },
        ],
        quiz: {
          title: "Complaints & Difficult Situations Quiz",
          questions: [
            { question_text: "What does LAST stand for in the complaint framework?", type: "single_choice", options: ["Look, Ask, Solve, Track", "Listen, Apologise, Solve, Thank", "Learn, Act, Serve, Tell", "Listen, Assess, Support, Transfer"], correct_answers: [1] },
            { question_text: "A guest says their food is cold. What should you NOT do?", type: "single_choice", options: ["Apologise and offer to remake it", "Blame the kitchen in front of the guest", "Ask if they'd like something else", "Remove the dish from the bill"], correct_answers: [1] },
            { question_text: "You should serve alcohol to a visibly intoxicated guest if they insist.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "POS System Basics",
        description: "Using the point-of-sale system for orders, payments, and table management",
        pages: [
          {
            type: "text",
            title: "POS Fundamentals",
            content: {
              text: "The POS (Point of Sale) system is the central hub for everything in service — orders, payments, table tracking, and reporting.\n\n**Logging In:**\n• You'll receive a unique PIN or swipe card. Never share your login or use someone else's — all actions are tracked under your ID.\n• Log in at the start of your shift, log out at the end.\n\n**Entering Orders:**\n1. Select the correct table number.\n2. Enter items by category (starters, mains, desserts, drinks).\n3. Add modifiers for special requests: 'no onions,' 'extra sauce,' 'allergy: nuts.'\n4. Assign items to the correct seat numbers.\n5. Send the order to the kitchen (this prints to the kitchen printer or displays on the KDS).\n6. Double-check before sending — once it's fired, the kitchen starts working.\n\n**Splitting Bills:**\n• Most POS systems allow you to split by seat, by item, or evenly.\n• Ask the guest: 'Would you like to split by what you ordered, or divide equally?'\n• Process each payment separately — card, cash, or a mix.\n\n**Voids & Discounts:**\n• If you need to void an item (wrong entry, guest changed their mind before it's made), you'll usually need a manager's override.\n• Never void an item after it's been served without manager approval.\n• Apply discounts or promotions only as authorised."
            },
          },
          {
            type: "text",
            title: "Payment Processing",
            content: {
              text: "**Taking Card Payments:**\n1. Present the bill in a bill folder. Give the guest time to review.\n2. When ready, bring the card machine to the table.\n3. Enter the amount. Let the guest tap, insert, or swipe their card.\n4. Wait for 'Approved' on the screen. Hand the receipt to the guest.\n5. If declined, say discreetly: 'It seems the payment didn't go through — would you like to try again or use another method?'\n\n**Taking Cash Payments:**\n1. Count the cash in front of the guest.\n2. Enter the amount tendered in the POS.\n3. Give the correct change.\n4. Place the change and receipt in the bill folder.\n\n**Tips & Service Charges:**\n• If your restaurant adds a service charge, inform guests when presenting the bill: 'A 12.5% service charge has been included.'\n• If a guest asks to remove the service charge, do so without argument — it's discretionary.\n• For card tips, process through the POS as instructed by your manager.\n\n**End of Shift:**\n• Run your cashout report. This shows total sales, payment types, and any voids or discounts under your ID.\n• Report any discrepancies to your manager before leaving."
            },
          },
          {
            type: "checklist",
            title: "POS Best Practices",
            content: {
              items: [
                "Always use your own login — never share PINs",
                "Double-check orders before sending to kitchen",
                "Assign items to correct seat numbers",
                "Add allergy modifiers clearly",
                "Get manager approval for voids and discounts",
                "Run cashout report at end of shift",
              ],
            },
          },
        ],
        quiz: {
          title: "POS System Quiz",
          questions: [
            { question_text: "Why should you never share your POS login with colleagues?", type: "single_choice", options: ["It slows down the system", "All actions are tracked under your ID", "It's a health and safety issue", "It uses more battery"], correct_answers: [1] },
            { question_text: "A guest's card is declined. What should you say?", type: "single_choice", options: ["'Your card has been declined'", "'It seems the payment didn't go through — would you like to try again or use another method?'", "'You need to pay cash'", "'I'll call the bank'"], correct_answers: [1] },
            { question_text: "You can void an item after it has been served without manager approval.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
    ],
  },
  {
    key: "boh",
    icon: ChefHat,
    title: "Restaurant Back of House",
    description: "Essential training for kitchen staff and food preparation",
    modules: [
      {
        title: "Kitchen Health & Safety",
        description: "Workplace safety, accident prevention, and emergency procedures in the kitchen",
        pages: [
          {
            type: "text",
            title: "Kitchen Safety Fundamentals",
            content: {
              text: "The kitchen is one of the most hazardous environments in any workplace. Burns, cuts, slips, and falls are common — but preventable.\n\n**Personal Protective Equipment (PPE):**\n• Wear non-slip, closed-toe safety shoes at all times.\n• Use oven gloves or heat-resistant gloves when handling hot pans, trays, and equipment.\n• Cut-resistant gloves should be available for tasks involving mandolines, slicers, or boning.\n• Chef's jacket sleeves protect arms from burns and splashes.\n\n**Preventing Burns & Scalds:**\n• Say 'Behind!' or 'Hot behind!' when moving behind colleagues with hot items.\n• Turn pot handles inward so they can't be knocked off the stove.\n• Never carry open containers of hot liquid — use lids.\n• Let oil cool before moving fryer baskets or disposing of used oil.\n\n**Preventing Cuts:**\n• Always use the correct knife for the task. Keep knives sharp — dull knives slip.\n• Cut away from your body. Use the claw grip to protect fingers.\n• Never leave knives in the sink. Wash, dry, and store immediately after use.\n• If a knife falls, step back — never try to catch it.\n\n**Preventing Slips & Falls:**\n• Clean spills immediately. If the floor is wet, place a 'Wet Floor' sign.\n• Keep walkways clear of boxes, crates, and equipment.\n• Walk, don't run, in the kitchen."
            },
          },
          {
            type: "text",
            title: "Emergency Procedures",
            content: {
              text: "**Fire:**\n• Know the location of fire extinguishers and fire blankets in the kitchen.\n• Grease fires: NEVER use water. Use a fire blanket or Class F extinguisher.\n• If a fire is uncontrollable: activate the alarm, evacuate, call emergency services.\n• Know your evacuation route and assembly point.\n\n**First Aid:**\n• Know the location of the first aid kit.\n• Minor burns: run under cool (not cold) water for at least 20 minutes. Do not apply ice, butter, or creams.\n• Cuts: apply pressure with a clean cloth. If bleeding doesn't stop within 10 minutes, seek medical help.\n• All injuries — no matter how minor — must be reported and logged in the accident book.\n\n**Gas Leaks:**\n• If you smell gas: do not operate any switches or flames.\n• Open windows and doors. Evacuate the area.\n• Turn off the gas supply at the mains if safe to do so.\n• Call the gas emergency number and notify your manager.\n\n**Chemical Safety:**\n• All cleaning chemicals must have a COSHH (Control of Substances Hazardous to Health) data sheet.\n• Never mix chemicals. Never store chemicals near food.\n• Always wear gloves and eye protection when using industrial cleaning products."
            },
          },
          {
            type: "checklist",
            title: "Kitchen Safety Daily Check",
            content: {
              items: [
                "Non-slip shoes worn by all kitchen staff",
                "Fire extinguisher and blanket accessible and in date",
                "First aid kit stocked and location known",
                "Walkways clear of obstructions",
                "Wet floor signs available and used",
                "All knives stored properly (not in sinks)",
                "Chemical cleaning products stored away from food",
                "Accident book location known by all staff",
              ],
            },
          },
        ],
        quiz: {
          title: "Kitchen Health & Safety Quiz",
          questions: [
            { question_text: "What should you do if a grease fire starts on the stove?", type: "single_choice", options: ["Pour water on it", "Use a fire blanket or Class F extinguisher", "Leave it and hope it goes out", "Blow on it"], correct_answers: [1] },
            { question_text: "How long should you run a minor burn under cool water?", type: "single_choice", options: ["5 minutes", "10 minutes", "At least 20 minutes", "30 seconds"], correct_answers: [2] },
            { question_text: "If a knife falls, you should try to catch it.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
            { question_text: "Which of these are ways to prevent slips in the kitchen?", type: "multi_choice", options: ["Clean spills immediately", "Wear non-slip shoes", "Run to move faster", "Keep walkways clear"], correct_answers: [0, 1, 3] },
          ],
        },
      },
      {
        title: "Food Hygiene & Cross-Contamination",
        description: "Food safety principles, HACCP basics, temperature controls, and preventing cross-contamination",
        pages: [
          {
            type: "text",
            title: "Food Safety Principles",
            content: {
              text: "Every kitchen team member is legally responsible for food safety. Foodborne illness can hospitalise or kill — it's that serious.\n\n**The Danger Zone:**\nBacteria multiply rapidly between 8°C and 63°C. This is the 'danger zone.' Food should spend as little time as possible in this range.\n\n**Temperature Rules:**\n• Fridges must be at 5°C or below (ideally 1–5°C).\n• Freezers must be at -18°C or below.\n• Cooking: most foods must reach a core temperature of 75°C for at least 2 minutes.\n• Reheating: food must reach 75°C core temperature. You can only reheat food once.\n• Hot holding: keep hot food at 63°C or above.\n• Cooling: hot food must be cooled to below 8°C within 90 minutes, then refrigerated.\n\n**FIFO — First In, First Out:**\n• Always use the oldest stock first. When new deliveries arrive, put them behind existing stock.\n• Check use-by dates daily. Remove expired items immediately.\n• Use-by dates are a legal safety limit (must be followed). Best-before dates are about quality (can use judgement)."
            },
          },
          {
            type: "text",
            title: "Cross-Contamination Prevention",
            content: {
              text: "Cross-contamination is the transfer of harmful bacteria from one food (or surface) to another. It's a leading cause of food poisoning outbreaks.\n\n**Colour-Coded Chopping Boards (UK Standard):**\n• 🔴 Red — Raw meat\n• 🔵 Blue — Raw fish\n• 🟡 Yellow — Cooked meat\n• 🟢 Green — Salad and fruit\n• 🟤 Brown — Vegetables\n• ⚪ White — Bakery and dairy\n\n**Key Rules:**\n• Never use the same board, knife, or utensil for raw and cooked food without washing between uses.\n• Store raw meat on the bottom shelf of the fridge — cooked and ready-to-eat food goes on top. This prevents raw meat juices dripping onto other food.\n• Separate raw and cooked food during preparation. Use different areas of the kitchen if possible.\n• Wash hands between handling different food types.\n\n**Allergen Cross-Contact:**\n• Separate utensils, boards, and fryer oil for allergen-free dishes.\n• Wipe down surfaces thoroughly before preparing allergen-free meals.\n• Clearly label allergen-free dishes when sending to the pass.\n\n**Personal Hygiene:**\n• Cover cuts and sores with blue waterproof plasters (blue so they're visible if they fall into food).\n• Wear disposable gloves when handling ready-to-eat food. Change gloves between tasks."
            },
          },
          {
            type: "checklist",
            title: "Food Safety Daily Checks",
            content: {
              items: [
                "Fridge temperatures logged (1–5°C)",
                "Freezer temperatures logged (-18°C or below)",
                "All food labelled with date and contents",
                "FIFO rotation followed — oldest stock at front",
                "Use-by dates checked, expired items removed",
                "Colour-coded boards used correctly",
                "Raw meat stored on bottom fridge shelf",
                "Hands washed between handling different foods",
                "Blue plasters available and used for cuts",
              ],
            },
          },
        ],
        quiz: {
          title: "Food Hygiene Quiz",
          questions: [
            { question_text: "What is the 'danger zone' temperature range where bacteria multiply rapidly?", type: "single_choice", options: ["0°C to 5°C", "8°C to 63°C", "20°C to 40°C", "63°C to 100°C"], correct_answers: [1] },
            { question_text: "What colour chopping board should be used for raw meat?", type: "single_choice", options: ["Blue", "Green", "Red", "White"], correct_answers: [2] },
            { question_text: "You can reheat food as many times as you like as long as it reaches 75°C.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
            { question_text: "Which of these prevent cross-contamination?", type: "multi_choice", options: ["Using colour-coded boards", "Storing raw meat on the bottom shelf", "Using the same knife for raw and cooked meat", "Washing hands between food types"], correct_answers: [0, 1, 3] },
          ],
        },
      },
      {
        title: "Kitchen Station Setup",
        description: "Mise en place, station organisation, and prep standards",
        pages: [
          {
            type: "text",
            title: "Mise en Place",
            content: {
              text: "'Mise en place' is French for 'everything in its place.' It's the foundation of professional kitchen work.\n\n**Why It Matters:**\nDuring service, there's no time to search for ingredients, sharpen a knife, or realise you've run out of something. Mise en place means you're ready before the first ticket prints.\n\n**Setting Up Your Station:**\n1. **Clean your station** — wipe down surfaces, check equipment works.\n2. **Check your prep list** — the chef or sous chef will provide a list of what needs to be prepped for the day.\n3. **Gather ingredients** — pull everything you need from the fridge, dry store, and freezer.\n4. **Prep your components** — dice, slice, portion, blanch, marinate. Follow recipes and portion guides exactly.\n5. **Organise your mise en place** — place prepped items in labelled containers within arm's reach. Hot side: sauces, garnishes, proteins portioned. Cold side: dressings, salad components, pre-plated items.\n6. **Sharpen your knives** — a sharp knife is a safe knife.\n7. **Stock backups** — have extra portions of high-demand items ready.\n\n**During Service:**\n• Keep your station clean as you go. Wipe down between dishes.\n• Restock mise en place during quiet moments, not when you're in the weeds.\n• If you're running low on a component, alert the sous chef immediately."
            },
          },
          {
            type: "checklist",
            title: "Station Setup Checklist",
            content: {
              items: [
                "Station cleaned and sanitised",
                "Equipment checked and working",
                "Prep list reviewed with chef",
                "All ingredients pulled and at correct temperature",
                "Components prepped to specification",
                "Mise en place organised and within reach",
                "Containers labelled with date and contents",
                "Knives sharpened and stored safely",
                "Backup portions ready for high-demand items",
                "Cleaning cloths and sanitiser at station",
              ],
            },
          },
        ],
        quiz: {
          title: "Station Setup Quiz",
          questions: [
            { question_text: "What does 'mise en place' mean?", type: "single_choice", options: ["Clean the kitchen", "Everything in its place", "Start cooking", "Time to eat"], correct_answers: [1] },
            { question_text: "When should you restock your mise en place during service?", type: "single_choice", options: ["After service ends", "During quiet moments", "Only if the chef tells you", "Never — prep once at the start"], correct_answers: [1] },
            { question_text: "You should alert the sous chef immediately if running low on a component.", type: "true_false", options: ["True", "False"], correct_answers: [0] },
          ],
        },
      },
      {
        title: "Food Preparation Standards",
        description: "Portioning, recipe adherence, plating consistency, and quality control",
        pages: [
          {
            type: "text",
            title: "Consistency Is Everything",
            content: {
              text: "A guest ordering the same dish on two different visits should get the same experience both times. Consistency is what separates a professional kitchen from an amateur one.\n\n**Recipe Adherence:**\n• Follow recipes exactly — every time. If a recipe says 200g of chicken, weigh 200g. Don't eyeball it.\n• Use scales, measuring jugs, and portion scoops for every component.\n• If you think a recipe needs adjusting, speak to the head chef — don't change it yourself.\n\n**Portioning:**\n• Every dish has a portion guide with exact weights for proteins, carbs, and garnishes.\n• Over-portioning wastes money. Under-portioning disappoints guests. Both are unacceptable.\n• Use portion scales, ladles, and ring moulds to maintain consistency.\n\n**Plating:**\n• Study the plating guide or photo for each dish. Plate exactly as shown.\n• Use the same plate type and size for each dish every time.\n• Wipe plate rims before sending to the pass — fingerprints and sauce smears are unacceptable.\n• Garnishes should be consistent: same size, same placement, same quantity.\n\n**Quality Checks:**\n• Taste as you cook (using a clean spoon each time). Season before it leaves your station.\n• Check temperature with a probe thermometer.\n• If a dish doesn't meet standard, don't send it. Remake it."
            },
          },
          {
            type: "checklist",
            title: "Prep & Quality Checklist",
            content: {
              items: [
                "Follow recipe specifications exactly",
                "Weigh all portions — don't eyeball",
                "Use correct plate type and size",
                "Plate according to the plating guide",
                "Wipe plate rims before sending",
                "Taste and season every dish (clean spoon each time)",
                "Check core temperatures with a probe",
                "Remake any dish that doesn't meet standard",
              ],
            },
          },
        ],
        quiz: {
          title: "Food Prep Standards Quiz",
          questions: [
            { question_text: "What should you do if you think a recipe needs adjusting?", type: "single_choice", options: ["Change it yourself", "Speak to the head chef first", "Ask the server", "Ignore it and cook your way"], correct_answers: [1] },
            { question_text: "Over-portioning is acceptable because guests get more food.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
            { question_text: "Which of these ensure consistent plating?", type: "multi_choice", options: ["Follow the plating guide or photo", "Use the same plate type each time", "Wipe plate rims before sending", "Plate however you feel like"], correct_answers: [0, 1, 2] },
          ],
        },
      },
      {
        title: "Equipment Safety & Maintenance",
        description: "Safe operation, cleaning, and basic maintenance of kitchen equipment",
        pages: [
          {
            type: "text",
            title: "Safe Equipment Use",
            content: {
              text: "Commercial kitchen equipment is powerful and dangerous if misused. Never operate equipment you haven't been trained on.\n\n**General Rules:**\n• Only use equipment you've been trained on and signed off for.\n• Never bypass safety guards, interlocks, or emergency stops.\n• Turn off and unplug equipment before cleaning or adjusting.\n• Report faulty equipment immediately — do not use it. Place an 'Out of Order' sign.\n\n**Deep Fryers:**\n• Never fill above the maximum oil line.\n• Lower baskets slowly to prevent splashing.\n• Never add water or ice to hot oil — it will cause a violent eruption.\n• Allow oil to cool completely before filtering or changing.\n• Clean the fryer and change the oil on the schedule set by your head chef.\n\n**Slicers & Mandolines:**\n• Always use the safety guard or food pusher. Never push food with your hands.\n• Cut-resistant gloves are mandatory when using mandolines.\n• Turn the blade to zero and unplug before cleaning.\n• Report dull blades — they cause more injuries than sharp ones.\n\n**Ovens & Grills:**\n• Use oven gloves for all hot equipment.\n• Stand to the side when opening oven doors to avoid steam burns.\n• Don't overload ovens — it affects cooking times and temperatures.\n• Clean grills and ovens after every service to prevent grease buildup (fire risk)."
            },
          },
          {
            type: "text",
            title: "Cleaning & Maintenance",
            content: {
              text: "Clean equipment works better, lasts longer, and is safer.\n\n**Daily Cleaning:**\n• Wipe down all surfaces and equipment after service.\n• Clean oven interiors, grill grates, and fryer exteriors.\n• Empty and clean the grease traps.\n• Sanitise food-contact surfaces with approved sanitiser.\n• Sweep and mop floors, paying attention to under equipment.\n\n**Weekly Deep Clean:**\n• Pull out equipment from walls and clean behind/beneath.\n• Descale dishwashers, steamers, and coffee machines.\n• Clean extraction hood filters (or more frequently if heavily used).\n• Check and clean walk-in fridge/freezer shelves and drains.\n\n**Maintenance Awareness:**\n• Listen for unusual sounds: grinding, rattling, or squealing often signal problems.\n• Check door seals on fridges and ovens — damaged seals waste energy and compromise temperatures.\n• Report any issues in the maintenance logbook.\n• Never attempt repairs yourself unless trained — call a qualified engineer."
            },
          },
          {
            type: "checklist",
            title: "Equipment Safety Checklist",
            content: {
              items: [
                "Only operate equipment you've been trained on",
                "Safety guards in place on all equipment",
                "Equipment turned off and unplugged before cleaning",
                "Oven gloves used for all hot equipment",
                "Fryer oil level checked (not above max line)",
                "Faulty equipment reported and signed 'Out of Order'",
                "Grills and ovens cleaned after service",
                "Maintenance issues logged in the book",
              ],
            },
          },
        ],
        quiz: {
          title: "Equipment Safety Quiz",
          questions: [
            { question_text: "What should you do before cleaning a slicer?", type: "single_choice", options: ["Just clean it carefully while it's on", "Turn the blade to zero and unplug it", "Ask someone to hold it steady", "Rinse it under water"], correct_answers: [1] },
            { question_text: "What happens if you add water to hot oil in a deep fryer?", type: "single_choice", options: ["Nothing", "The oil cools down faster", "It causes a violent eruption", "It cleans the fryer"], correct_answers: [2] },
            { question_text: "You should attempt to repair faulty equipment yourself to save time.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Kitchen Communication & Ticket System",
        description: "The pass, calling orders, ticket flow, and team communication during service",
        pages: [
          {
            type: "text",
            title: "How the Ticket System Works",
            content: {
              text: "Clear communication is what keeps a busy kitchen running smoothly. The ticket system is the backbone of kitchen-to-front coordination.\n\n**The Flow:**\n1. Server enters the order into the POS.\n2. A ticket (or 'docket') prints at the kitchen pass or appears on the KDS (Kitchen Display System).\n3. The head chef or expeditor (expo) reads the ticket aloud ('calling' the order).\n4. Each station acknowledges: 'Yes, chef!' or 'Heard!'\n5. Stations cook their components. When ready, they call: '[Item] ready!'\n6. The expo checks all components are ready, plates the dish (or checks plating), and calls: 'Service!'\n7. A runner or server collects the dish from the pass.\n\n**The Expeditor (Expo):**\nThe expo is the conductor of the kitchen. They:\n• Control the flow of tickets — deciding the order in which tables are fired.\n• Coordinate timing — ensuring all dishes for a table come out together.\n• Quality-check every plate before it leaves the pass.\n• Communicate with FOH about delays, 86'd items, and special requests.\n\n**Key Calls:**\n• 'Fire table 5!' — Start cooking mains for table 5.\n• 'How long on the lamb?' — Asking a station for a time estimate.\n• 'All day, 3 steaks, 2 fish!' — Total count of items needed across all active tickets.\n• '86 sea bass!' — Sea bass is unavailable. Stop selling it."
            },
          },
          {
            type: "text",
            title: "Communication Standards",
            content: {
              text: "**Movement Calls:**\nThe kitchen is tight and fast-moving. Verbal communication prevents accidents.\n• 'Behind!' — I'm walking behind you.\n• 'Hot behind!' — I'm carrying something hot behind you.\n• 'Sharp!' or 'Knife behind!' — I'm carrying a knife.\n• 'Corner!' — I'm coming around a blind corner.\n• 'Coming through!' — Clear the path, I'm moving through.\n\n**Communication Rules:**\n• When the chef calls an order, respond with 'Yes, chef!' or 'Heard!' — silence means the message wasn't received.\n• Ask for clarification if you don't understand a ticket. It's better to ask than to cook the wrong thing.\n• If you're falling behind ('in the weeds'), tell the chef immediately. They can reassign tasks or adjust the ticket flow.\n• Never shout across the kitchen. Speak clearly and directly to the person you're addressing.\n\n**Teamwork:**\n• If your station is quiet and a colleague is struggling, offer help. 'Chef, I'm clear — do you need a hand on grill?'\n• Keep personal issues out of the kitchen. Service time is about focus and professionalism.\n• Debrief after service — discuss what went well and what to improve. This is how teams get better."
            },
          },
          {
            type: "checklist",
            title: "Service Communication Checklist",
            content: {
              items: [
                "Acknowledge all orders with 'Yes, chef!' or 'Heard!'",
                "Use movement calls: Behind, Hot, Sharp, Corner",
                "Communicate delays or issues to the expo immediately",
                "Call out when items are ready for the pass",
                "Ask for clarification if a ticket is unclear",
                "Offer help to colleagues when your station is clear",
                "Participate in post-service debrief",
              ],
            },
          },
        ],
        quiz: {
          title: "Kitchen Communication Quiz",
          questions: [
            { question_text: "What does '86' mean in kitchen terminology?", type: "single_choice", options: ["Table 86 is ready", "An item is unavailable — stop selling it", "86 orders today", "Cook 86 portions"], correct_answers: [1] },
            { question_text: "What should you say when carrying something hot behind a colleague?", type: "single_choice", options: ["'Excuse me'", "'Hot behind!'", "'Move!'", "Nothing — just walk carefully"], correct_answers: [1] },
            { question_text: "If you're falling behind during service, you should stay quiet and try to catch up alone.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
            { question_text: "What does the expeditor (expo) do?", type: "multi_choice", options: ["Controls the flow of tickets", "Quality-checks every plate", "Washes dishes", "Coordinates timing between stations"], correct_answers: [0, 1, 3] },
          ],
        },
      },
    ],
  },
  {
    key: "cafe",
    icon: Coffee,
    title: "Café / Barista",
    description: "Barista skills, coffee knowledge, and café service training",
    modules: [
      {
        title: "Coffee Knowledge & Espresso Basics",
        description: "Understanding coffee beans, espresso extraction, and drink foundations",
        pages: [
          {
            type: "text",
            title: "Coffee Fundamentals",
            content: {
              text: "Great coffee starts with understanding what you're working with.\n\n**Coffee Beans:**\n• **Arabica** — Grown at higher altitudes. Smoother, more complex flavours with natural sweetness and acidity. Most specialty coffee is Arabica.\n• **Robusta** — Grown at lower altitudes. Stronger, more bitter, higher caffeine content. Often used in blends for body and crema.\n• Beans are roasted on a spectrum: light roasts preserve origin flavours (fruity, floral); dark roasts emphasise body and bitterness (chocolate, caramel, smoky).\n\n**Espresso — The Foundation:**\nAlmost every coffee drink starts with espresso. A well-pulled shot should have:\n• **Dose:** 18–20g of ground coffee (for a double shot).\n• **Yield:** 36–40g of liquid espresso (roughly 1:2 ratio of dose to yield).\n• **Time:** 25–30 seconds extraction time.\n• **Appearance:** Rich, golden-brown crema on top. Not too pale (under-extracted) or too dark (over-extracted).\n\n**Taste Indicators:**\n• **Sour/sharp** = under-extracted. Grind finer or increase extraction time.\n• **Bitter/harsh** = over-extracted. Grind coarser or decrease extraction time.\n• **Balanced** = sweet, with pleasant acidity and a smooth finish. This is the goal."
            },
          },
          {
            type: "text",
            title: "The Espresso Menu",
            content: {
              text: "Every barista should know these core drinks and how they differ:\n\n• **Espresso** — A single or double shot served straight. 25–30ml (single) or 50–60ml (double).\n• **Americano** — Espresso topped with hot water. Similar strength to filter coffee but different flavour profile.\n• **Latte** — Espresso with steamed milk and a thin layer of microfoam. Smooth and milky. Served in a large cup.\n• **Cappuccino** — Espresso with equal parts steamed milk and thick, airy foam. Served in a smaller cup. Often dusted with cocoa.\n• **Flat White** — Double espresso with velvety steamed milk (microfoam throughout, no dry foam). Stronger milk-to-coffee ratio than a latte.\n• **Mocha** — Espresso + chocolate sauce/powder + steamed milk. Often topped with whipped cream.\n• **Macchiato** — Espresso 'stained' with a small amount of milk foam. Intense and strong.\n\n**Milk Alternatives:**\nKnow your alternative milks and how they behave:\n• Oat milk — froths well, neutral flavour, most popular alternative.\n• Soy milk — can curdle in acidic coffee; pour gently.\n• Almond milk — thin, doesn't froth as well. Barista-grade versions are better.\n• Coconut milk — adds sweetness, thinner texture."
            },
          },
          {
            type: "checklist",
            title: "Espresso Quality Checklist",
            content: {
              items: [
                "Dose: 18-20g for a double shot",
                "Yield: 36-40g liquid espresso",
                "Extraction time: 25-30 seconds",
                "Crema: golden-brown, even coverage",
                "Taste: balanced — not sour, not bitter",
                "Grinder adjusted if shots are off",
                "Portafilter clean and dry before dosing",
                "Knock box emptied regularly",
              ],
            },
          },
        ],
        quiz: {
          title: "Coffee Knowledge Quiz",
          questions: [
            { question_text: "What is the ideal extraction time for a double espresso?", type: "single_choice", options: ["10-15 seconds", "25-30 seconds", "45-60 seconds", "2 minutes"], correct_answers: [1] },
            { question_text: "A sour, sharp espresso shot is likely:", type: "single_choice", options: ["Over-extracted — grind coarser", "Under-extracted — grind finer", "Perfect — serve it", "Too hot"], correct_answers: [1] },
            { question_text: "A flat white and a latte are the same drink.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
            { question_text: "Which milk alternative froths most consistently?", type: "single_choice", options: ["Almond milk", "Oat milk (barista grade)", "Coconut milk", "Rice milk"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Milk Steaming & Latte Art",
        description: "Proper milk steaming technique, microfoam, and basic latte art patterns",
        pages: [
          {
            type: "text",
            title: "Steaming Milk Properly",
            content: {
              text: "Milk steaming is the skill that separates average coffee from exceptional coffee.\n\n**The Goal:** Silky, glossy microfoam with no visible bubbles. It should look like wet white paint.\n\n**Steps:**\n1. **Start with cold, fresh milk.** Fill the jug to just below the spout — roughly one-third full (milk doubles in volume when steamed).\n2. **Purge the steam wand** before use — a quick burst clears condensation.\n3. **Position the wand:** tip just below the surface, slightly off-centre. The wand should create a gentle whirlpool.\n4. **Stretching phase (first 3-5 seconds):** Keep the tip near the surface. You should hear a gentle 'tss tss' sound — this introduces air and creates foam. Lower the jug slightly to let air in.\n5. **Texturing phase:** Once you have enough foam, submerge the tip deeper. The milk should spin in a vortex, incorporating the foam evenly. No more 'tss' sound — just a smooth whirring.\n6. **Temperature:** Stop at 60-65°C (140-150°F). If you don't have a thermometer, the jug should be too hot to hold comfortably for more than 2 seconds.\n7. **Tap and swirl:** Tap the jug on the counter to pop any large bubbles, then swirl gently to create a glossy, uniform texture.\n\n**Common Mistakes:**\n• Too much air → big, dry bubbles (cappuccino foam, not microfoam).\n• Not enough air → flat, thin milk with no body.\n• Overheating (above 70°C) → burnt, bitter milk that ruins the drink.\n• Milk re-steamed → never re-steam milk. Start fresh every time."
            },
          },
          {
            type: "text",
            title: "Basic Latte Art",
            content: {
              text: "Latte art isn't just aesthetic — it proves your milk is properly textured. If you can pour a pattern, your microfoam is right.\n\n**The Heart (Beginner):**\n1. Pour steamed milk from a height into the centre of the espresso. This pushes the milk under the crema.\n2. When the cup is about two-thirds full, bring the jug close to the surface.\n3. Pour steadily into one spot — you'll see a white circle form.\n4. When nearly full, pull the jug through the circle to create the heart point.\n\n**The Rosetta (Intermediate):**\n1. Start the same as the heart — pour from height to fill the cup halfway.\n2. Bring the jug close and gently wiggle your wrist side to side while slowly moving backward.\n3. This creates the leaf pattern.\n4. When nearly full, pull through the centre to create the stem.\n\n**Tips:**\n• Speed and confidence matter more than perfection at first.\n• The 'canvas' (crema) matters — a good espresso with even crema gives you a better base.\n• Practice with water and a drop of dish soap if you want to drill the motion without wasting milk.\n• Consistency comes with hundreds of repetitions. Be patient."
            },
          },
          {
            type: "checklist",
            title: "Milk Steaming Checklist",
            content: {
              items: [
                "Use cold, fresh milk — never re-steam",
                "Fill jug to one-third (below the spout)",
                "Purge steam wand before use",
                "Stretch milk in first 3-5 seconds (gentle 'tss' sound)",
                "Texture milk with a spinning vortex (no air sound)",
                "Stop at 60-65°C — don't overheat",
                "Tap jug to pop large bubbles, swirl for gloss",
                "Wipe and purge steam wand after every use",
              ],
            },
          },
        ],
        quiz: {
          title: "Milk Steaming Quiz",
          questions: [
            { question_text: "What temperature should steamed milk reach?", type: "single_choice", options: ["40-45°C", "60-65°C", "75-80°C", "90°C"], correct_answers: [1] },
            { question_text: "You can re-steam leftover milk to save waste.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
            { question_text: "What does the 'tss tss' sound indicate during steaming?", type: "single_choice", options: ["The milk is overheating", "Air is being introduced (stretching phase)", "The wand needs cleaning", "The milk is done"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Café Health, Safety & Hygiene",
        description: "Cleanliness standards, food safety, and workplace safety specific to café environments",
        pages: [
          {
            type: "text",
            title: "Café Hygiene Standards",
            content: {
              text: "A clean café isn't just pleasant — it's a legal requirement.\n\n**Handwashing:**\nWash hands: at the start of each shift, after using the toilet, after handling cash, after touching bins, after eating or drinking, and between tasks (e.g., switching from food to drinks).\n\n**Machine Cleanliness:**\n• **Group heads:** Flush (backflush with water) between every shot. Chemical backflush at least once daily.\n• **Steam wand:** Wipe with a dedicated damp cloth and purge after EVERY use. Milk residue builds bacteria rapidly.\n• **Grinder:** Brush out the doser and chute at end of day. Deep clean weekly.\n• **Drip trays:** Empty and clean throughout the shift — don't let them overflow.\n\n**Food Handling:**\n• All food (sandwiches, cakes, pastries) must be displayed in covered cases or under sneeze guards.\n• Use tongs or gloves — never bare hands — for ready-to-eat items.\n• Label all prepped food with date and time. Discard items past their shelf life.\n• Fridges at 1-5°C. Check and log temperatures at opening and closing.\n\n**Cleaning Schedule:**\n• During shifts: wipe counters, clear tables, empty bins when two-thirds full.\n• End of shift: deep clean the machine, mop floors, sanitise all surfaces, restock.\n• Weekly: clean display cases, descale the machine, deep clean the grinder."
            },
          },
          {
            type: "checklist",
            title: "Café Hygiene Checklist",
            content: {
              items: [
                "Hands washed at start of shift and between tasks",
                "Group heads flushed between every shot",
                "Steam wand wiped and purged after every use",
                "Drip trays emptied regularly",
                "Food displayed under cover / sneeze guard",
                "Tongs or gloves used for ready-to-eat food",
                "All prepped food labelled with date and time",
                "Fridge temperatures logged (1-5°C)",
                "Counters and tables wiped throughout shift",
                "End-of-day deep clean completed",
              ],
            },
          },
        ],
        quiz: {
          title: "Café Hygiene Quiz",
          questions: [
            { question_text: "How often should you wipe and purge the steam wand?", type: "single_choice", options: ["Once a day", "After every use", "Once a week", "Only when it looks dirty"], correct_answers: [1] },
            { question_text: "What temperature should café fridges be kept at?", type: "single_choice", options: ["1-5°C", "8-10°C", "Room temperature", "Below -18°C"], correct_answers: [0] },
            { question_text: "You can handle ready-to-eat pastries with bare hands if your hands are clean.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Café Customer Service & Till Operations",
        description: "Taking orders, handling payments, and delivering great café customer service",
        pages: [
          {
            type: "text",
            title: "Café Service Standards",
            content: {
              text: "Café service is different from restaurant service — it's faster-paced and more casual, but the core principles are the same.\n\n**The Greeting:**\n• Greet every customer with a smile and eye contact, even during a rush.\n• 'Good morning! What can I get you?' is simple and effective.\n• If there's a queue, acknowledge those waiting: 'I'll be with you in just a moment.'\n\n**Taking Orders:**\n• Listen carefully. Repeat the order back: 'So that's a large oat flat white and a blueberry muffin?'\n• Ask clarifying questions: 'Is that to have in or take away?', 'Any milk preference?', 'Would you like that heated?'\n• If a customer is unsure, make a recommendation: 'Our flat white is really popular, or if you like something sweeter, the mocha is great.'\n\n**Speed & Accuracy:**\n• In a café, speed matters — but not at the expense of quality or accuracy.\n• Write the order on the cup or ticket immediately.\n• Make drinks in the order they were received.\n• Call the customer's name (or order) clearly when the drink is ready.\n\n**Handling Difficult Moments:**\n• If a drink is wrong, remake it immediately without argument: 'I'm sorry about that, I'll make you a fresh one right now.'\n• Stay calm during rushes. Customers can sense stress — your composure sets the tone."
            },
          },
          {
            type: "text",
            title: "Till & Payment Operations",
            content: {
              text: "**Using the Till:**\n• Log in with your own credentials at the start of every shift.\n• Enter items as the customer orders them — don't try to memorise and enter later.\n• Apply modifiers correctly: size upgrades, milk alternatives (often an extra charge), extra shots, syrup flavours.\n• If an item isn't in the system, don't guess the price — ask your manager.\n\n**Payments:**\n• Most café transactions are card/contactless. Tap and confirm before the customer walks away.\n• For cash: count the change out loud when handing it back.\n• If a payment fails, be discreet: 'It doesn't seem to have gone through — shall we try again?'\n\n**Loyalty Programmes:**\n• If your café has a loyalty card or app, ask every customer: 'Are you collecting stamps?' or 'Do you have our app?'\n• Don't be pushy — one ask per visit is enough.\n\n**End of Shift:**\n• Cash up your till. Count the float and compare to the POS report.\n• Report any discrepancies to your manager immediately.\n• Leave the till area clean and stocked with receipt paper."
            },
          },
          {
            type: "checklist",
            title: "Café Service Checklist",
            content: {
              items: [
                "Greet every customer with a smile",
                "Repeat orders back for accuracy",
                "Ask: have in or take away? Milk preference?",
                "Write orders on cups/tickets immediately",
                "Make drinks in order received",
                "Call customer name/order clearly when ready",
                "Ask about loyalty card or app",
                "Cash up till at end of shift",
              ],
            },
          },
        ],
        quiz: {
          title: "Café Service & Till Quiz",
          questions: [
            { question_text: "What should you do if a customer says their drink is wrong?", type: "single_choice", options: ["Explain that it was made correctly", "Remake it immediately without argument", "Ask them to pay for a new one", "Ignore them"], correct_answers: [1] },
            { question_text: "When should you enter items into the till?", type: "single_choice", options: ["After the customer has left", "At the end of the rush", "As the customer orders them", "Only for card payments"], correct_answers: [2] },
            { question_text: "You should ask about the loyalty programme once per visit, not repeatedly.", type: "true_false", options: ["True", "False"], correct_answers: [0] },
          ],
        },
      },
    ],
  },
];
