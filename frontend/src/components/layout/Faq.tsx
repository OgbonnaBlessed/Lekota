import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import Badge from "../ui/badge";

const items = [
  {
    value: "item-1",
    trigger: "What is LEKOTA and who is it for?",
    content:
      "LEKOTA is a multi-tenant appointment scheduling and resource allocation platform designed for service-based organisations such as healthcare clinics, university service units, care facilities, and independent practitioners. It helps organisations efficiently manage bookings, allocate resources, prevent scheduling conflicts, and monitor operational performance within a single system.",
  },
  {
    value: "item-2",
    trigger: "How does the 10-day free trial work?",
    content:
      "Each organisation that registers on LEKOTA is automatically granted a 10-day free trial with full access to all platform features. This allows administrators to configure scheduling rules, onboard users, and evaluate the system’s capabilities before committing to a subscription.",
  },
  {
    value: "item-3",
    trigger: "What happens after my free trial ends?",
    content:
      "At the end of the 10-day trial period, organisations are required to subscribe in order to continue using LEKOTA. If no subscription is activated, access to scheduling and administrative features will be restricted until payment is completed.",
  },
  {
    value: "item-4",
    trigger: "Can I manage multiple users in my organization?",
    content:
      "Yes. LEKOTA supports role-based access control, allowing organisations to create and manage multiple users such as administrators, schedulers, service providers, and clients. Each role has clearly defined permissions to ensure secure and structured system usage.",
  },
  {
    value: "item-5",
    trigger: "Does LEKOTA prevent double bookings?",
    content:
      "Yes. LEKOTA includes built-in conflict detection and scheduling validation mechanisms that automatically prevent overlapping appointments. The system also enforces configurable buffer times and resource availability rules to ensure accurate and reliable scheduling.",
  },
];

const Faq = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-5">
      <div className="w-6xl max-w-full flex flex-col items-center justify-center gap-5">
        <Badge title="FAQ" />

        <h1 className="w-full text-3xl sm:text-5xl font-medium leading-none tracking-[-4%] text-center">
          Frequently Asked Questions
        </h1>

        <p className="w-lg max-w-full sm:text-xl text-lg text-center text-gray-500">
          Everything you need to know about using LEKOTA for scheduling and
          resource management.
        </p>

        <div className="w-2xl max-w-full flex items-center justify-center mt-10">
          <Accordion
            type="single"
            collapsible
            className="w-full flex flex-col gap-5"
          >
            {items.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className="py-2 sm:py-4 px-4 sm:px-8 rounded-[12px] border border-[#2D36E066]"
              >
                <AccordionTrigger>{item.trigger}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Faq;
