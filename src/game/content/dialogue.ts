import type { DialogueSequence } from '../types';

export const dialogues: Record<string, DialogueSequence> = {
  // UW Campus
  uw_professor_blocked: {
    id: 'uw_professor_blocked',
    lines: [
      { speaker: 'PROF. ALBERT', text: 'Have you turned in your final project yet? Complete it first, then come see me.' },
    ],
  },
  uw_professor_done: {
    id: 'uw_professor_done',
    lines: [
      { speaker: 'PROF. ALBERT', text: 'You graduated! Get out of here and go make something of yourself.' },
    ],
  },
  uw_professor_intro: {
    id: 'uw_professor_intro',
    lines: [
      { speaker: 'PROF. ALBERT', text: 'Congratulations on graduating from the College of Engineering.' },
      { speaker: 'PROF. ALBERT', text: 'Through coursework and internships, you\'ve developed a strong foundation in systems thinking:' },
      { speaker: 'PROF. ALBERT', text: 'process mapping/modeling, discrete event simulation, statistical modeling.' },
      { speaker: 'PROF. ALBERT', text: 'Remember: All models are wrong, some are useful.' },
      { speaker: 'PROF. ALBERT', text: 'Take this TUMI bag — it will store your achievements as you grow.' },
      { text: 'Kevin received the TUMI!' },
      { speaker: 'PROF. ALBERT', text: 'And one more thing. Every Badger needs a partner on their journey.' },
      { text: 'Kevin received BUCKY' },
    ],
    setFlag: 'uw_talked_professor',
  },
  uw_whiteboard: {
    id: 'uw_whiteboard',
    lines: [
      { text: 'The whiteboard shows a Stochastic model of a supply chain system' },
      { text: 'Industrial & Systems Engineering: optimize the whole system, not just the parts.' },
    ],
    setFlag: 'uw_inspected_whiteboard',
  },
  uw_computer: {
    id: 'uw_computer',
    lines: [
      { text: 'Logging in to my.wisc.edu...' },
      { text: 'Uploading capstone project...' },
      { text: 'A project on supply chain optimization using discrete event simulation' },
      { text: 'and stochastic programming' },
      { text: 'Im sure this will prove essential for every role ahead.' },
      { text: 'Upload complete. Project submitted.' },
    ],
    setFlag: 'uw_inspected_computer',
  },
  uw_trophy: {
    id: 'uw_trophy',
    lines: [
      { text: 'A display case with academic awards and certifications.' },
      { text: 'Dean\'s List. Lean Six Sigma. Robert Ratner Scholarship' },
    ],
  },
  uw_trophy2: {
    id: 'uw_trophy2',
    lines: [
      { text: 'Internship certification of completion' },
      { text: 'KRAFT FOODS — KOOL-AID MANUFACTURING PLANT' },
      { text: 'Summer Internship: Production line optimization at the Kool-Aid facility.' },
      { text: 'Kevin mapped the packaging line, identified bottlenecks, and redesigned the workflow.' },
      { text: 'Result: 15% throughput increase. First taste of real manufacturing IE work.' },
      { text: '"Nothing beats seeing theory work on an actual factory floor."' },
    ],
  },
  uw_wb_supply_chain: {
    id: 'uw_wb_supply_chain',
    lines: [
      { text: 'SUPPLY CHAIN OPTIMIZATION' },
      { text: 'Diagram shows raw materials → production → distribution → customer.' },
      { text: 'Notes: "Minimize total cost subject to demand constraints. Think globally, optimize locally."' },
    ],
  },
  uw_wb_simulation: {
    id: 'uw_wb_simulation',
    lines: [
      { text: 'DISCRETE EVENT SIMULATION' },
      { text: 'Monte Carlo methods, queuing models, arrival distributions.' },
      { text: 'Notes: "Model the system before you change the system."' },
    ],
  },
  uw_sign: {
    id: 'uw_sign',
    lines: [
      { text: 'University of Wisconsin—Madison' },
      { text: 'College of Engineering — Industrial & Systems Engineering' },
    ],
  },
  uw_lab_sign: {
    id: 'uw_lab_sign',
    lines: [
      { text: 'Lab Instructions:' },
      { text: '1. Talk to the PROFESSOR (straight ahead)' },
      { text: '2. Submit your senior capstone project' },
      { text: 'Also explore the whiteboards, Kraft exhibit, and more!' },
    ],
  },
  uw_badger_receive: {
    id: 'uw_badger_receive',
    lines: [
      { speaker: 'PROF. JOHNSON', text: 'One more thing. Every Badger needs a partner on their journey.' },
      { speaker: 'PROF. JOHNSON', text: 'This Badger will help you face the challenges ahead. Take good care of it!' },
      { text: 'Kevin received BUCKY the Badger!' },
    ],
    setFlag: 'uw_received_badger',
  },
  uw_graduation: {
    id: 'uw_graduation',
    lines: [
      { text: 'Congratulations! B.S. in Industrial & Systems Engineering, 2016.' },
      { text: 'Kevin received the SYSTEMS BADGE!' },
      { text: 'The world outside awaits. Time to put systems thinking to work.' },
    ],
    setFlag: 'uw_graduated',
  },
  uw_gate_blocked: {
    id: 'uw_gate_blocked',
    lines: [
      { text: 'The door is locked! You can\'t leave yet.' },
      { text: 'Before you go, you must:' },
      { text: '1) Talk to the PROFESSOR' },
      { text: '2) Complete your COMPUTER assignment' },
    ],
  },

  // Interview Trail
  interview_sign: {
    id: 'interview_sign',
    lines: [
      { text: 'Career Fair — Madison, WI' },
      { text: 'Recruiters from top consulting firms are here today.' },
    ],
  },
  interviewer_1: {
    id: 'interviewer_1',
    lines: [
      { speaker: 'RECRUITER', text: 'Tell me about a time you analyzed a complex system.' },
      { speaker: 'KEVIN', text: 'In my capstone project, I modeled a manufacturing line using discrete event simulation...' },
      { speaker: 'KEVIN', text: '...identifying a 23% throughput improvement by reorganizing the bottleneck station.' },
      { speaker: 'RECRUITER', text: 'Impressive systems analysis! You clearly think end-to-end.' },
    ],
    setFlag: 'interview_1_done',
  },
  interviewer_2: {
    id: 'interviewer_2',
    lines: [
      { speaker: 'RECRUITER', text: 'When teams speak different languages, how do you get Sales, Finance, and Engineering to move together?' },
      { speaker: 'KEVIN', text: 'I start with the shared process. Map the handoffs, identify where data breaks down, then build a common language around the workflow.' },
      { speaker: 'RECRUITER', text: 'Great communication instincts. You bridge the gap between business and technical.' },
    ],
    setFlag: 'interview_2_done',
  },
  interviewer_3: {
    id: 'interviewer_3',
    lines: [
      { speaker: 'RECRUITER', text: 'How comfortable are you with enterprise software implementations?' },
      { speaker: 'KEVIN', text: 'Very. I\'ve studied ERP architectures, understand MRP logic, and I\'m eager to see it applied at scale.' },
      { speaker: 'RECRUITER', text: 'We have an opening in Chicago. Welcome to consulting.' },
      { text: 'Kevin received the OFFER LETTER!' },
    ],
    setFlag: 'interview_3_done',
  },
  chicago_train: {
    id: 'chicago_train',
    lines: [
      { text: 'Kevin boards the Hiawatha to Chicago.' },
    ],
    setFlag: 'moved_to_chicago',
  },
  interview_gate_blocked: {
    id: 'interview_gate_blocked',
    lines: [
      { text: 'The station is closed! Complete all interviews and find a train ticket first.' },
    ],
  },
  chicago_train_sign: {
    id: 'chicago_train_sign',
    lines: [
      { text: 'HIAWATHA LINE — Madison to Chicago' },
      { text: 'Service resumes once all interviews are complete.' },
    ],
  },
  train_ticket_found: {
    id: 'train_ticket_found',
    lines: [
      { text: 'Kevin found a train ticket to Chicago!' },
      { text: 'Kevin added train ticket to his backpack!' },
    ],
  },

  // Baker Tilly
  bt_intro: {
    id: 'bt_intro',
    lines: [
      { speaker: 'PLANT MANAGER', text: 'Welcome to the factory. We need help modernizing our operations.' },
      { speaker: 'PLANT MANAGER', text: 'Our ERP system is outdated. Orders get lost, inventory is a mess, and the books don\'t balance.' },
      { speaker: 'PLANT MANAGER', text: 'Walk the floor. Talk to each department. Then show us what a real system looks like.' },
    ],
    setFlag: 'bt_intro_done',
  },
  bt_edi: {
    id: 'bt_edi',
    lines: [
      { speaker: 'RECEIVING CLERK', text: 'Our EDI transactions keep failing. Customers send orders in different formats.' },
      { text: 'Kevin configured EDI document mapping and translation rules.' },
      { text: 'Electronic Data Interchange: standardized. Orders flow in cleanly now.' },
    ],
    setFlag: 'bt_edi_done',
  },
  bt_mrp: {
    id: 'bt_mrp',
    lines: [
      { speaker: 'PLANNER', text: 'We plan production on spreadsheets. Lead times are wrong. We\'re always short on materials.' },
      { text: 'Kevin implemented Material Requirements Planning with accurate BOMs and lead times.' },
      { text: 'MRP: operational. The right materials arrive at the right time.' },
    ],
    setFlag: 'bt_mrp_done',
  },
  bt_shopfloor: {
    id: 'bt_shopfloor',
    lines: [
      { speaker: 'FOREMAN', text: 'We track production on paper. Nobody knows what\'s actually on the line.' },
      { text: 'Kevin designed shop floor production tracking with real-time work order status.' },
      { text: 'Shop Floor Control: live. Every work order is visible and traceable.' },
    ],
    setFlag: 'bt_shopfloor_done',
  },
  bt_purchasing: {
    id: 'bt_purchasing',
    lines: [
      { speaker: 'BUYER', text: 'Purchase orders are manual. We duplicate orders, miss approvals, overspend.' },
      { text: 'Kevin streamlined purchasing workflows with automated PO generation and approval routing.' },
      { text: 'Purchasing: automated. Spend is controlled and visible.' },
    ],
    setFlag: 'bt_purchasing_done',
  },
  bt_cost: {
    id: 'bt_cost',
    lines: [
      { speaker: 'CONTROLLER', text: 'Our cost accounting is a black box. We can\'t trace costs to products.' },
      { text: 'Kevin built a cost accounting model mapping labor, materials, and overhead to each product.' },
      { text: 'Cost Accounting: transparent. Every dollar is traceable.' },
    ],
    setFlag: 'bt_cost_done',
  },
  bt_boss: {
    id: 'bt_boss',
    lines: [
      { speaker: 'PLANT CONTROLLER', text: 'You\'ve touched every part of our operation.' },
      { speaker: 'PLANT CONTROLLER', text: 'EDI and MRP — the entire ERP is live and connected.' },
      { speaker: 'PLANT CONTROLLER', text: 'The new system reflects real business requirements. Well done.' },
      { text: 'Kevin received the MANUFACTURING BADGE!' },
    ],
    setFlag: 'bt_complete',
  },
  bt_gate_blocked: {
    id: 'bt_gate_blocked',
    lines: [
      { text: 'The exit is locked. Complete all battles and speak with the Plant Controller.' },
    ],
  },

  // Deloitte Airport Terminal
  dt_airport_intro: {
    id: 'dt_airport_intro',
    lines: [
      { speaker: 'SENIOR MANAGER', text: 'Welcome to O\'Hare, consultant. Your flight boards in 3 minutes.' },
      { speaker: 'SENIOR MANAGER', text: 'You need to clear TSA and check in at all four gates before boarding.' },
      { speaker: 'SENIOR MANAGER', text: 'Meta, Cloudflare, Warehousing, Revenue — the Captain won\'t wait.' },
      { text: 'The boarding timer has started! Move fast.' },
    ],
    setFlag: 'dt_lobby_done',
  },
  dt_tsa_blocked: {
    id: 'dt_tsa_blocked',
    lines: [
      { speaker: 'TSA AGENT', text: 'Hold it. Security check. Answer correctly or submit to a manual audit.' },
    ],
  },
  dt_gate_meta: {
    id: 'dt_gate_meta',
    lines: [
      { speaker: 'GATE AGENT', text: 'Gate A — Meta engagement. Data center cost modeling project.' },
      { text: 'Kevin built a cost forecasting app with React and Python.' },
      { text: 'Forecasting accuracy improved by 40%. Project logged!' },
    ],
  },
  dt_gate_cloudflare: {
    id: 'dt_gate_cloudflare',
    lines: [
      { speaker: 'GATE AGENT', text: 'Gate B — Cloudflare engagement. Pre-IPO systems scaling.' },
      { text: 'Kevin integrated procurement, billing, and cash application with Dell Boomi.' },
      { text: 'IPO-ready operations: achieved. Project logged!' },
    ],
  },
  dt_gate_warehousing: {
    id: 'dt_gate_warehousing',
    lines: [
      { speaker: 'GATE AGENT', text: 'Gate C — Warehousing engagement. CRM & Order Management.' },
      { text: 'Kevin implemented CRM + OMS + Inventory + Returns on NetSuite for a $3B+ client.' },
      { text: 'End-to-end visibility: achieved. Project logged!' },
    ],
  },
  dt_gate_revenue: {
    id: 'dt_gate_revenue',
    lines: [
      { speaker: 'GATE AGENT', text: 'Gate D — Revenue Recognition engagement. ASC 606 compliance.' },
      { text: 'Kevin designed ASC 606 models and deployed RPA for automated journal entries.' },
      { text: 'Audit-ready every quarter. Project logged!' },
    ],
  },
  dt_pilot: {
    id: 'dt_pilot',
    lines: [
      { speaker: 'CAPTAIN', text: 'All four gates cleared. Welcome aboard, consultant.' },
      { speaker: 'CAPTAIN', text: 'Your work across Meta, Cloudflare, Warehousing, and Revenue has been outstanding.' },
      { text: 'Kevin received the CONSULTING BADGE!' },
      { text: 'Kevin earned 1K Flight Status and Marriott Platinum!' },
      { text: 'He can now "Fly" to any previous level instantly.' },
    ],
    setFlag: 'dt_complete',
  },
  dt_pilot_blocked: {
    id: 'dt_pilot_blocked',
    lines: [
      { speaker: 'CAPTAIN', text: 'You haven\'t checked in at all four gates yet. I can\'t let you board.' },
    ],
  },
  dt_elevator_blocked: {
    id: 'dt_elevator_blocked',
    lines: [
      { text: 'The jetway is closed. Complete all gates and speak with the Captain.' },
    ],
  },
  dt_flight_missed: {
    id: 'dt_flight_missed',
    lines: [
      { text: 'FINAL BOARDING CALL... MISSED!' },
      { text: 'The flight left without you. Back to the terminal entrance.' },
    ],
  },
  dt_sign_gate_a: {
    id: 'dt_sign_gate_a',
    lines: [{ text: 'GATE A — Meta: Data Center Cost Modeling' }],
  },
  dt_sign_gate_b: {
    id: 'dt_sign_gate_b',
    lines: [{ text: 'GATE B — Cloudflare: Pre-IPO Scaling' }],
  },
  dt_sign_gate_c: {
    id: 'dt_sign_gate_c',
    lines: [{ text: 'GATE C — Warehousing: CRM & Order Management' }],
  },
  dt_sign_gate_d: {
    id: 'dt_sign_gate_d',
    lines: [{ text: 'GATE D — Revenue: ASC 606 Compliance' }],
  },

  karma_reset: {
    id: 'karma_reset',
    lines: [
      { text: 'Room reset! Karma restored to starting value.' },
    ],
  },

  // Reddit HQ — Casino
  reddit_needs_snoo: {
    id: 'reddit_needs_snoo',
    lines: [
      { text: 'The door is locked. You need a companion from the tall grass first.' },
    ],
  },
  reddit_grounds_sign: {
    id: 'reddit_grounds_sign',
    lines: [
      { text: 'r/WALLSTREETBETS — San Francisco' },
      { text: 'Welcome to the casino, degenerate. YOLO your way to tendies.' },
    ],
  },
  reddit_room_locked: {
    id: 'reddit_room_locked',
    lines: [
      { text: 'The gate is sealed.' },
    ],
  },
  reddit_find_money: {
    id: 'reddit_find_money',
    lines: [
      { text: 'Kevin walks into r/WallStreetBets... it\'s literally a casino.' },
      { text: 'Kevin found $20 on the floor! Diamond hands activated.' },
      { text: 'RDDT share price starts at $20. Get to $200 or you\'re holding bags forever.' },
      { text: 'Talk to the PIT BOSS to YOLO at the roulette table. Work the desks if you go full ape.' },
    ],
  },
  reddit_casino_dealer: {
    id: 'reddit_casino_dealer',
    lines: [
      { speaker: 'PIT BOSS', text: 'Welcome to r/WallStreetBets Roulette! Sir, this is a casino.' },
    ],
  },
  reddit_casino_rules: {
    id: 'reddit_casino_rules',
    lines: [
      { text: 'r/WSB HOUSE RULES:' },
      { text: '1. Pick a wager, then YOLO on RED or BLACK.' },
      { text: '2. Win: tendies. Lose: loss porn.' },
      { text: '3. Reach $200 or you\'re a bag holder. Go broke? Grind the desks for $50.' },
    ],
  },
  reddit_casino_lore: {
    id: 'reddit_casino_lore',
    lines: [
      { text: 'Kevin built order management, 20+ integrations, and subledger automation at Reddit.' },
      { text: 'Month-end close went from 12 days to 3 during $200M to $2.2B+ revenue growth.' },
      { text: 'SOX compliance, data pipelines, treasury management — all automated.' },
    ],
  },
  reddit_work_sox_npc: {
    id: 'reddit_work_sox_npc',
    lines: [
      { speaker: 'SOX ANALYST', text: 'The quarterly SOX audit needs doing. Want to take it on? Pays $50.' },
    ],
  },
  reddit_work_integration_npc: {
    id: 'reddit_work_integration_npc',
    lines: [
      { speaker: 'INTEGRATION DEV', text: 'Got a broken pipeline. Fix it and earn $50 for the share price.' },
    ],
  },
  reddit_work_close_npc: {
    id: 'reddit_work_close_npc',
    lines: [
      { speaker: 'CLOSE MANAGER', text: 'Month-end close is coming up fast. Help out and earn $50.' },
    ],
  },

  // Hall of Fame
  hall_of_fame_intro: {
    id: 'hall_of_fame_intro',
    lines: [
      { text: 'Welcome to the Hall of Fame.' },
      { text: 'You\'ve walked through Kevin\'s entire career journey.' },
      { text: 'From systems engineering to finance applications leadership.' },
      { text: 'Thank you for playing!' },
    ],
  },

  // Generic
  npc_generic: {
    id: 'npc_generic',
    lines: [
      { text: 'Good luck out there!' },
    ],
  },
};
