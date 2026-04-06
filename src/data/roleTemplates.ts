import { ShieldCheck, Shirt, Workflow, UtensilsCrossed, ChefHat, Coffee } from "lucide-react";

import handwashingImg from "@/assets/templates/handwashing.jpg";
import uniformImg from "@/assets/templates/uniform.jpg";
import shoesImg from "@/assets/templates/shoes.jpg";
import foodTempImg from "@/assets/templates/food-temperature.jpg";
import openingImg from "@/assets/templates/opening.jpg";
import closingImg from "@/assets/templates/closing.jpg";
import greetingImg from "@/assets/templates/greeting.jpg";
import espressoImg from "@/assets/templates/espresso.jpg";
import latteArtImg from "@/assets/templates/latte-art.jpg";
import choppingBoardsImg from "@/assets/templates/chopping-boards.jpg";
import fireSafetyImg from "@/assets/templates/fire-safety.jpg";
import posTerminalImg from "@/assets/templates/pos-terminal.jpg";
import knifeSafetyImg from "@/assets/templates/knife-safety.jpg";
import miseEnPlaceImg from "@/assets/templates/mise-en-place.jpg";
import firstImpressionsImg from "@/assets/templates/first-impressions.jpg";
import personalHygieneImg from "@/assets/templates/personal-hygiene.jpg";
import feelingUnwellImg from "@/assets/templates/feeling-unwell.jpg";
import tenFiveRuleImg from "@/assets/templates/ten-five-rule.jpg";
import anticipateNeedsImg from "@/assets/templates/anticipate-needs.jpg";
import positiveLanguageImg from "@/assets/templates/positive-language.jpg";
import askAllergiesImg from "@/assets/templates/ask-allergies.jpg";
import checkingOnGuestImg from "@/assets/templates/checking-on-guest.jpg";
import first30SecondsImg from "@/assets/templates/first-30-seconds.jpg";
import seatingGuestsImg from "@/assets/templates/seating-guests.jpg";
import managingWaitImg from "@/assets/templates/managing-wait.jpg";
import reservationsImg from "@/assets/templates/reservations.jpg";
import knowMenuImg from "@/assets/templates/know-menu.jpg";
import takingOrdersImg from "@/assets/templates/taking-orders.jpg";
import upsellingImg from "@/assets/templates/upselling.jpg";
import specialsImg from "@/assets/templates/specials.jpg";
import complaintsOpportunitiesImg from "@/assets/templates/complaints-opportunities.jpg";
import listenImg from "@/assets/templates/listen.jpg";
import apologiseImg from "@/assets/templates/apologise.jpg";
import solveImg from "@/assets/templates/solve.jpg";
import thankImg from "@/assets/templates/thank.jpg";
import posLoginImg from "@/assets/templates/pos-login.jpg";
import enteringOrdersImg from "@/assets/templates/entering-orders.jpg";
import takingPaymentImg from "@/assets/templates/taking-payment.jpg";
import voidsDiscountsImg from "@/assets/templates/voids-discounts.jpg";

export interface TemplatePage {
  type: "text" | "checklist" | "image";
  title: string;
  content: { text?: string; items?: string[]; url?: string };
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
  // ─── FRONT OF HOUSE ───────────────────────────────────────
  {
    key: "foh",
    icon: UtensilsCrossed,
    title: "Restaurant Front of House",
    description: "Complete training for servers, hosts, and FOH staff",
    modules: [
      {
        title: "Dress Code & Hygiene",
        description: "Uniform standards and personal presentation",
        pages: [
          { type: "text", title: "First Impressions", content: { text: "Your appearance sets the tone before you speak. Clean, neat, and professional — always." } },
          { type: "image", title: "Your Uniform", content: { text: "Wear the provided uniform. Clean, pressed, in good condition. Name badge on the left.", url: uniformImg } },
          { type: "image", title: "Footwear", content: { text: "Closed-toe, non-slip black shoes only. No trainers, sandals, or open-toe shoes.", url: shoesImg } },
          { type: "text", title: "Personal Hygiene", content: { text: "Short clean nails, no polish. Hair tied back. Minimal jewellery. Deodorant, no strong fragrance." } },
          { type: "image", title: "Wash Your Hands", content: { text: "Before shifts, after breaks, after handling cash, and after clearing plates.", url: handwashingImg } },
          { type: "text", title: "Feeling Unwell?", content: { text: "Vomiting, diarrhoea, or fever? Stay home. You must be symptom-free for 48 hours before returning." } },
          { type: "checklist", title: "Pre-Shift Check", content: { items: ["Clean uniform, no stains", "Name badge visible", "Non-slip black shoes", "Hair tied back", "Nails short, no polish", "Hands washed"] } },
        ],
        quiz: {
          title: "Dress Code & Hygiene Quiz",
          questions: [
            { question_text: "Which shoes must FOH staff wear?", type: "single_choice", options: ["White trainers", "Closed-toe non-slip black shoes", "Any comfortable shoes", "Open-toe sandals"], correct_answers: [1] },
            { question_text: "How long symptom-free before returning after illness?", type: "single_choice", options: ["12 hours", "24 hours", "48 hours", "72 hours"], correct_answers: [2] },
            { question_text: "Nail polish is acceptable for FOH staff.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Customer Service",
        description: "Core hospitality principles and guest interaction",
        pages: [
          { type: "text", title: "The 10/5 Rule", content: { text: "At 10 feet — smile and make eye contact. At 5 feet — greet them warmly." } },
          { type: "image", title: "Welcome Every Guest", content: { text: "Acknowledge guests within 30 seconds. A genuine smile goes a long way.", url: greetingImg } },
          { type: "text", title: "Anticipate Needs", content: { text: "Empty glass? Dropped napkin? Confused look? Act before the guest asks. That's great service." } },
          { type: "text", title: "Positive Language", content: { text: "Say 'Absolutely!' not 'No problem.' Say 'Great choice!' not 'OK.' Words matter." } },
          { type: "text", title: "Always Ask About Allergies", content: { text: "\"Does anyone have allergies or dietary requirements?\" If unsure about ingredients, check with the kitchen." } },
          { type: "text", title: "Checking on the guest", content: { text: "Check on your table approximately two minutes after the food has been delivered, or after they have had a chance to take about two bites." } },
          { type: "checklist", title: "Service Checklist", content: { items: ["Greet within 30 seconds", "Ask about allergies", "Repeat orders back", "Check in after food arrives", "Thank guests when they leave"] } },
        ],
        quiz: {
          title: "Customer Service Quiz",
          questions: [
            { question_text: "In the 10/5 Rule, what do you do at 10 feet?", type: "single_choice", options: ["Greet verbally", "Make eye contact and smile", "Take their order", "Ignore until seated"], correct_answers: [1] },
            { question_text: "When should you check on food?", type: "single_choice", options: ["Immediately", "After 2 minutes", "After 10 minutes", "Only if flagged"], correct_answers: [1] },
            { question_text: "It's OK to guess about ingredients.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Greeting & Seating",
        description: "Host duties and first impressions",
        pages: [
          { type: "text", title: "The First 30 Seconds", content: { text: "A guest's first impression is set in 30 seconds. Acknowledge them immediately, even if busy." } },
          { type: "image", title: "The Welcome", content: { text: "Smile, make eye contact. Ask about their reservation or party size.", url: greetingImg } },
          { type: "text", title: "Seating Guests", content: { text: "Walk at their pace. Pull out chairs for elderly guests. Present menus and introduce their server." } },
          { type: "text", title: "Managing a Wait", content: { text: "Give a specific time: '15 minutes' beats 'not too long.' Take their name and text when ready." } },
          { type: "text", title: "Reservations", content: { text: "Check the book at the start of every shift. Note VIPs, allergies, and celebrations." } },
          { type: "checklist", title: "Host Station Checklist", content: { items: ["Review reservations", "Note special requests", "Host station clean, menus stocked", "Greet guests within 10 seconds"] } },
        ],
        quiz: {
          title: "Greeting & Seating Quiz",
          questions: [
            { question_text: "How long to hold a reserved table past booking time?", type: "single_choice", options: ["5 minutes", "15 minutes", "30 minutes", "1 hour"], correct_answers: [1] },
            { question_text: "Seat a couple at a 6-top(table for 6 people) during peak hours.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
            { question_text: "What if the restaurant is full with no reservation?", type: "single_choice", options: ["Turn them away", "Give honest wait time, offer the bar", "Seat at a dirty table", "Ignore them"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Taking Orders",
        description: "Order accuracy and menu knowledge",
        pages: [
          { type: "text", title: "Know the Menu", content: { text: "Every dish, every ingredient, every allergen. If you can't describe it, you can't sell it." } },
          { type: "text", title: "Taking Orders Right", content: { text: "Use seat numbers. Write everything down. Read the order back to confirm. Never rely on memory." } },
          { type: "text", title: "Upselling Done Right", content: { text: "Be specific: 'Our sea bass is incredible tonight' beats 'Want a starter?' Read the table first." } },
          { type: "text", title: "Specials", content: { text: "Memorise daily specials before service. Describe flavours, not just ingredients." } },
          { type: "checklist", title: "Order Checklist", content: { items: ["Know specials and 86'd items (Items unavailable)", "Ask about allergies", "Use seat numbers", "Write every order down", "Read order back to guest", "Enter into POS promptly"] } },
        ],
        quiz: {
          title: "Taking Orders Quiz",
          questions: [
            { question_text: "Why use seat numbers for orders?", type: "single_choice", options: ["It's faster", "Food goes to the right person", "Legal requirement", "Guests prefer it"], correct_answers: [1] },
            { question_text: "Always write down orders, even if you'll remember.", type: "true_false", options: ["True", "False"], correct_answers: [0] },
            { question_text: "What does '86'd' mean?", type: "single_choice", options: ["A table number", "Item unavailable", "A reservation code", "A discount"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Handling Complaints",
        description: "De-escalation and complaint resolution",
        pages: [
          { type: "text", title: "Complaints = Opportunities", content: { text: "A well-handled complaint turns a frustrated guest into a loyal regular. Don't fear it." } },
          { type: "text", title: "L — Listen", content: { text: "Let the guest speak. Don't interrupt. Maintain eye contact and nod to show you're engaged." } },
          { type: "text", title: "A — Apologise", content: { text: "\"I'm sorry about that. That's not the experience we want for you.\" Don't blame others." } },
          { type: "text", title: "S — Solve", content: { text: "Offer a fix: remake the dish, remove it from the bill. Unsure? Ask your manager." } },
          { type: "text", title: "T — Thank", content: { text: "\"Thank you for telling us — it helps us improve.\" Follow up before they leave." } },
          { type: "checklist", title: "Complaint Checklist", content: { items: ["Listen without interrupting", "Apologise sincerely", "Offer a specific solution", "Involve manager if needed", "Follow up before they leave"] } },
        ],
        quiz: {
          title: "Handling Complaints Quiz",
          questions: [
            { question_text: "What does LAST stand for?", type: "single_choice", options: ["Look, Ask, Solve, Track", "Listen, Apologise, Solve, Thank", "Learn, Act, Serve, Tell", "Listen, Assess, Support, Transfer"], correct_answers: [1] },
            { question_text: "Guest says food is cold — what NOT to do?", type: "single_choice", options: ["Apologise and remake", "Blame the kitchen", "Offer something else", "Remove from bill"], correct_answers: [1] },
            { question_text: "Serve alcohol to a visibly intoxicated guest if they insist.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "POS & Payments",
        description: "Using the POS system and processing payments",
        pages: [
          { type: "image", title: "Your POS System", content: { text: "The POS is your central hub for orders, payments, and table tracking.", url: posTerminalImg } },
          { type: "text", title: "Logging In", content: { text: "Use your own PIN. Never share it. All actions are tracked under your ID." } },
          { type: "text", title: "Entering Orders", content: { text: "Select correct table → add items by seat → note modifications → double-check → send to kitchen." } },
          { type: "text", title: "Taking Payment", content: { text: "Present the bill. Bring the card machine. Wait for 'Approved.' If declined, be discreet." } },
          { type: "text", title: "Voids & Discounts", content: { text: "Always need manager approval. Never void a served item without asking first." } },
          { type: "checklist", title: "POS Checklist", content: { items: ["Use your own login", "Double-check before sending", "Assign items to seat numbers", "Add allergy modifiers", "Manager approval for voids", "Run cashout at end of shift"] } },
        ],
        quiz: {
          title: "POS & Payments Quiz",
          questions: [
            { question_text: "Why never share your POS login?", type: "single_choice", options: ["Slows the system", "All actions tracked under your ID", "Health and safety", "Battery usage"], correct_answers: [1] },
            { question_text: "Card declined — what to say?", type: "single_choice", options: ["'Your card is declined'", "'Payment didn't go through — try again or another method?'", "'Pay cash'", "'I'll call the bank'"], correct_answers: [1] },
            { question_text: "You can void served items (removing itesms from bill) without manager approval.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
    ],
  },

  // ─── BACK OF HOUSE ────────────────────────────────────────
  {
    key: "boh",
    icon: ChefHat,
    title: "Restaurant Back of House",
    description: "Essential training for kitchen staff and food preparation",
    modules: [
      {
        title: "Kitchen Health & Safety",
        description: "Accident prevention and emergency procedures",
        pages: [
          { type: "text", title: "Kitchen Hazards", content: { text: "Burns, cuts, slips — common but preventable. Safety starts with awareness." } },
          { type: "image", title: "Non-Slip Shoes", content: { text: "Closed-toe, non-slip shoes at all times. Use oven gloves for hot items.", url: shoesImg } },
          { type: "image", title: "Knife Safety", content: { text: "Use the claw grip. Cut away from your body. Never catch a falling knife.", url: knifeSafetyImg } },
          { type: "text", title: "Preventing Burns", content: { text: "Say 'Hot behind!' when passing. Turn pot handles inward. Never carry open hot liquids." } },
          { type: "image", title: "Fire Safety", content: { text: "Know where extinguishers are. Grease fires: NEVER use water. Use a fire blanket.", url: fireSafetyImg } },
          { type: "text", title: "First Aid", content: { text: "Burns: cool water 20 minutes. Cuts: apply pressure. All injuries must be logged." } },
          { type: "checklist", title: "Safety Daily Check", content: { items: ["Non-slip shoes worn", "Fire equipment accessible", "First aid kit stocked", "Walkways clear", "Knives stored properly"] } },
        ],
        quiz: {
          title: "Kitchen Health & Safety Quiz",
          questions: [
            { question_text: "Grease fire — what to do?", type: "single_choice", options: ["Pour water", "Use fire blanket or Class F extinguisher", "Leave it", "Blow on it"], correct_answers: [1] },
            { question_text: "How long to cool a minor burn?", type: "single_choice", options: ["5 minutes", "10 minutes", "At least 20 minutes", "30 seconds"], correct_answers: [2] },
            { question_text: "Try to catch a falling knife.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Food Hygiene",
        description: "Food safety, temperatures, and cross-contamination",
        pages: [
          { type: "text", title: "The Danger Zone", content: { text: "Bacteria multiply fast between 8°C and 63°C. Keep food out of this range." } },
          { type: "image", title: "Check Temperatures", content: { text: "Fridges: 1–5°C. Freezers: -18°C. Cooking: 75°C core for 2 mins.", url: foodTempImg } },
          { type: "image", title: "Colour-Coded Boards", content: { text: "Red = raw meat. Blue = fish. Green = salad. Yellow = cooked meat. Never mix.", url: choppingBoardsImg } },
          { type: "text", title: "FIFO Rule", content: { text: "First In, First Out. Use oldest stock first. Check use-by dates daily." } },
          { type: "image", title: "Wash Your Hands", content: { text: "Between different food types, after touching raw meat, and after breaks.", url: handwashingImg } },
          { type: "text", title: "Allergen Safety", content: { text: "Separate utensils for allergen-free dishes. Label clearly. Wipe surfaces before prep." } },
          { type: "checklist", title: "Food Safety Checks", content: { items: ["Fridge temps logged (1–5°C)", "All food labelled and dated", "FIFO rotation followed", "Colour-coded boards used", "Raw meat on bottom shelf", "Hands washed between tasks"] } },
        ],
        quiz: {
          title: "Food Hygiene Quiz",
          questions: [
            { question_text: "What is the danger zone?", type: "single_choice", options: ["0–5°C", "8–63°C", "20–40°C", "63–100°C"], correct_answers: [1] },
            { question_text: "Red chopping board is for?", type: "single_choice", options: ["Fish", "Salad", "Raw meat", "Dairy"], correct_answers: [2] },
            { question_text: "You can reheat food as many times as you want.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Station Setup",
        description: "Mise en place and prep standards",
        pages: [
          { type: "text", title: "Mise en Place", content: { text: "\"Everything in its place.\" Get ready before service so you never scramble during a rush." } },
          { type: "image", title: "Organised Station", content: { text: "Prepped items in labelled containers, within arm's reach. Sauces, garnishes, proteins ready.", url: miseEnPlaceImg } },
          { type: "text", title: "Setting Up", content: { text: "Clean station → check prep list → gather ingredients → prep components → organise mise en place." } },
          { type: "text", title: "During Service", content: { text: "Keep your station clean as you go. Restock during quiet moments, not when in the weeds." } },
          { type: "text", title: "Running Low?", content: { text: "Alert the sous chef immediately. Don't wait until you've run out." } },
          { type: "checklist", title: "Station Checklist", content: { items: ["Station cleaned", "Equipment checked", "Prep list reviewed", "Ingredients pulled", "Containers labelled", "Knives sharpened"] } },
        ],
        quiz: {
          title: "Station Setup Quiz",
          questions: [
            { question_text: "What does 'mise en place' mean?", type: "single_choice", options: ["Clean the kitchen", "Everything in its place", "Start cooking", "Time to eat"], correct_answers: [1] },
            { question_text: "When to restock during service?", type: "single_choice", options: ["After service", "During quiet moments", "Only if told", "Never"], correct_answers: [1] },
            { question_text: "Alert sous chef immediately if running low.", type: "true_false", options: ["True", "False"], correct_answers: [0] },
          ],
        },
      },
      {
        title: "Food Prep Standards",
        description: "Portioning, plating, and quality control",
        pages: [
          { type: "text", title: "Consistency Is Key", content: { text: "Same dish, two visits, same experience. Follow recipes exactly — every single time." } },
          { type: "text", title: "Portioning", content: { text: "Use scales, scoops, and moulds. Over-portioning wastes money. Under-portioning disappoints guests." } },
          { type: "text", title: "Plating", content: { text: "Follow the plating guide. Same plate, same placement, same garnish. Wipe rims before sending." } },
          { type: "text", title: "Quality Checks", content: { text: "Taste with a clean spoon. Check temps with a probe. If it's not right, remake it." } },
          { type: "checklist", title: "Prep & Quality Checklist", content: { items: ["Follow recipe exactly", "Weigh all portions", "Plate to the guide", "Wipe plate rims", "Taste and season", "Check core temps"] } },
        ],
        quiz: {
          title: "Food Prep Quiz",
          questions: [
            { question_text: "Think a recipe needs adjusting?", type: "single_choice", options: ["Change it yourself", "Speak to head chef first", "Ask the server", "Ignore it"], correct_answers: [1] },
            { question_text: "Over-portioning is fine because guests get more.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Equipment Safety",
        description: "Safe operation and maintenance of kitchen equipment",
        pages: [
          { type: "text", title: "Golden Rule", content: { text: "Never operate equipment you haven't been trained on. No exceptions." } },
          { type: "text", title: "Deep Fryers", content: { text: "Never overfill. Lower baskets slowly. NEVER add water to hot oil — it erupts violently." } },
          { type: "image", title: "Knife & Slicer Safety", content: { text: "Always use safety guards. Turn blade to zero and unplug before cleaning.", url: knifeSafetyImg } },
          { type: "text", title: "Ovens & Grills", content: { text: "Use oven gloves. Stand to the side when opening doors. Clean after every service." } },
          { type: "text", title: "Faulty Equipment", content: { text: "Report it immediately. Place an 'Out of Order' sign. Never attempt DIY repairs." } },
          { type: "checklist", title: "Equipment Checklist", content: { items: ["Only use trained equipment", "Safety guards in place", "Unplug before cleaning", "Oven gloves for hot items", "Faulty equipment reported", "Cleaned after service"] } },
        ],
        quiz: {
          title: "Equipment Safety Quiz",
          questions: [
            { question_text: "Before cleaning a slicer?", type: "single_choice", options: ["Clean while on", "Turn blade to zero and unplug", "Ask someone to hold it", "Rinse under water"], correct_answers: [1] },
            { question_text: "Adding water to hot fryer oil?", type: "single_choice", options: ["Nothing", "Cools it down", "Causes violent eruption", "Cleans it"], correct_answers: [2] },
            { question_text: "Repair faulty equipment yourself to save time.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Kitchen Communication",
        description: "Ticket system and team communication during service",
        pages: [
          { type: "text", title: "The Ticket Flow", content: { text: "Order enters POS → ticket prints → chef calls it → stations acknowledge → cook → plate → service!" } },
          { type: "text", title: "Key Kitchen Calls", content: { text: "'Fire table 5!' = start cooking. '86 sea bass!' = unavailable. 'All day, 3 steaks!' = total count." } },
          { type: "text", title: "Movement Calls", content: { text: "'Behind!' — 'Hot behind!' — 'Sharp!' — 'Corner!' These prevent accidents. Use them every time." } },
          { type: "text", title: "Always Acknowledge", content: { text: "When the chef calls, respond 'Yes, chef!' or 'Heard!' Silence means the message wasn't received." } },
          { type: "text", title: "Falling Behind?", content: { text: "Tell the chef immediately. They can reassign tasks. Don't stay quiet and struggle alone." } },
          { type: "checklist", title: "Communication Checklist", content: { items: ["Acknowledge all orders", "Use movement calls", "Communicate delays immediately", "Call out when items ready", "Offer help when clear"] } },
        ],
        quiz: {
          title: "Kitchen Communication Quiz",
          questions: [
            { question_text: "What does '86' mean?", type: "single_choice", options: ["Table 86 ready", "Item unavailable", "86 orders today", "Cook 86 portions"], correct_answers: [1] },
            { question_text: "Carrying something hot behind a colleague?", type: "single_choice", options: ["'Excuse me'", "'Hot behind!'", "'Move!'", "Walk carefully"], correct_answers: [1] },
            { question_text: "If falling behind, stay quiet and catch up alone.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
    ],
  },

  // ─── CAFÉ / BARISTA ───────────────────────────────────────
  {
    key: "cafe",
    icon: Coffee,
    title: "Café / Barista",
    description: "Barista skills, coffee knowledge, and café service training",
    modules: [
      {
        title: "Coffee & Espresso Basics",
        description: "Coffee beans, espresso extraction, and core drinks",
        pages: [
          { type: "text", title: "Two Main Beans", content: { text: "Arabica = smooth, complex, sweet. Robusta = strong, bitter, more caffeine. Most specialty is Arabica." } },
          { type: "image", title: "Pulling a Shot", content: { text: "Dose: 18–20g. Yield: 36–40g. Time: 25–30 seconds. Look for golden-brown crema.", url: espressoImg } },
          { type: "text", title: "Taste Check", content: { text: "Sour = under-extracted (grind finer). Bitter = over-extracted (grind coarser). Balanced = perfect." } },
          { type: "text", title: "Know Your Drinks", content: { text: "Latte = milk-heavy. Cappuccino = equal foam. Flat white = double shot, velvety milk. Americano = espresso + water." } },
          { type: "text", title: "Milk Alternatives", content: { text: "Oat = froths well, most popular. Soy = can curdle. Almond = thin. Use barista-grade versions." } },
          { type: "checklist", title: "Espresso Quality Check", content: { items: ["Dose: 18–20g", "Yield: 36–40g", "Time: 25–30 seconds", "Crema: golden-brown", "Taste: balanced", "Portafilter clean and dry"] } },
        ],
        quiz: {
          title: "Coffee Knowledge Quiz",
          questions: [
            { question_text: "Ideal extraction time for a double espresso?", type: "single_choice", options: ["10–15 seconds", "25–30 seconds", "45–60 seconds", "2 minutes"], correct_answers: [1] },
            { question_text: "A sour shot is likely:", type: "single_choice", options: ["Over-extracted", "Under-extracted", "Perfect", "Too hot"], correct_answers: [1] },
            { question_text: "A flat white and a latte are the same drink.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Milk Steaming & Latte Art",
        description: "Proper steaming technique and basic patterns",
        pages: [
          { type: "text", title: "The Goal", content: { text: "Silky, glossy microfoam — no visible bubbles. It should look like wet white paint." } },
          { type: "text", title: "Steaming Steps", content: { text: "Cold milk, one-third full. Purge wand. Stretch 3–5 sec (tss sound). Then texture with a vortex." } },
          { type: "text", title: "Temperature", content: { text: "Stop at 60–65°C. Too hot to hold for 2 seconds = done. Never overheat past 70°C." } },
          { type: "image", title: "Latte Art", content: { text: "If you can pour a pattern, your microfoam is right. Start with the heart — simplest pattern.", url: latteArtImg } },
          { type: "text", title: "Common Mistakes", content: { text: "Too much air = dry bubbles. Not enough = flat milk. Overheated = burnt taste. Never re-steam." } },
          { type: "checklist", title: "Milk Steaming Checklist", content: { items: ["Cold fresh milk", "Jug one-third full", "Purge wand first", "Stretch 3–5 seconds", "Stop at 60–65°C", "Tap and swirl", "Wipe and purge wand after"] } },
        ],
        quiz: {
          title: "Milk Steaming Quiz",
          questions: [
            { question_text: "Target temperature for steamed milk?", type: "single_choice", options: ["40–45°C", "60–65°C", "75–80°C", "90°C"], correct_answers: [1] },
            { question_text: "You can re-steam leftover milk.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
            { question_text: "The 'tss' sound means:", type: "single_choice", options: ["Milk overheating", "Air being introduced", "Wand needs cleaning", "Milk is done"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Café Hygiene",
        description: "Cleanliness standards and food safety in the café",
        pages: [
          { type: "image", title: "Wash Your Hands", content: { text: "Start of shift, after cash, after bins, between tasks. Always.", url: handwashingImg } },
          { type: "text", title: "Machine Cleanliness", content: { text: "Flush group heads between shots. Wipe and purge steam wand after EVERY use." } },
          { type: "image", title: "Food Temperatures", content: { text: "Fridges at 1–5°C. Log temps at opening and closing. Discard items past shelf life.", url: foodTempImg } },
          { type: "text", title: "Food Display", content: { text: "Use covered cases or sneeze guards. Tongs or gloves only — never bare hands for ready-to-eat items." } },
          { type: "text", title: "Labelling", content: { text: "All prepped food must be labelled with date and time. No exceptions." } },
          { type: "checklist", title: "Café Hygiene Checklist", content: { items: ["Hands washed between tasks", "Group heads flushed", "Steam wand wiped after every use", "Food under cover", "Tongs/gloves for food", "All food labelled", "Fridge temps logged"] } },
        ],
        quiz: {
          title: "Café Hygiene Quiz",
          questions: [
            { question_text: "How often to wipe the steam wand?", type: "single_choice", options: ["Once a day", "After every use", "Once a week", "When dirty"], correct_answers: [1] },
            { question_text: "Café fridge temperature?", type: "single_choice", options: ["1–5°C", "8–10°C", "Room temp", "Below -18°C"], correct_answers: [0] },
            { question_text: "Handle pastries with bare hands if clean.", type: "true_false", options: ["True", "False"], correct_answers: [1] },
          ],
        },
      },
      {
        title: "Café Service & Till",
        description: "Taking orders and handling payments",
        pages: [
          { type: "text", title: "The Greeting", content: { text: "Smile, eye contact, even during a rush. 'Good morning! What can I get you?'" } },
          { type: "image", title: "Taking Orders", content: { text: "Listen, repeat back, clarify: 'Have in or take away? Milk preference?'", url: posTerminalImg } },
          { type: "text", title: "Speed & Accuracy", content: { text: "Write orders on cups immediately. Make drinks in order received. Call the name when ready." } },
          { type: "text", title: "Payments", content: { text: "Enter items as ordered. For cash, count change out loud. If card fails, be discreet." } },
          { type: "text", title: "Wrong Drink?", content: { text: "Remake immediately, no argument. 'Sorry about that — I'll make a fresh one right now.'" } },
          { type: "checklist", title: "Café Service Checklist", content: { items: ["Greet every customer", "Repeat orders back", "Ask: have in or take away?", "Write orders immediately", "Make drinks in order", "Ask about loyalty card", "Cash up till at end"] } },
        ],
        quiz: {
          title: "Café Service Quiz",
          questions: [
            { question_text: "Customer says drink is wrong?", type: "single_choice", options: ["Explain it's correct", "Remake immediately", "Ask them to pay again", "Ignore"], correct_answers: [1] },
            { question_text: "When to enter items into the till?", type: "single_choice", options: ["After they leave", "End of rush", "As they order", "Card payments only"], correct_answers: [2] },
            { question_text: "Ask about loyalty once per visit, not repeatedly.", type: "true_false", options: ["True", "False"], correct_answers: [0] },
          ],
        },
      },
    ],
  },
];
