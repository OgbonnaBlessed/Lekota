const terms_of_service = [
  {
    header: "Introduction",
    body: {
      text: "Welcome to LEKOTA. These Terms of Service govern your access to and use of the LEKOTA platform, including all features related to appointment scheduling, resource allocation, and payment processing. By registering an account or using the platform, you agree to be bound by these terms.",
    },
  },
  {
    header: "Eligibility",
    body: {
      text: "You must be at least 18 years old and authorized to act on behalf of an organization to use LEKOTA. By registering, you confirm that the information provided is accurate and complete.",
    },
  },
  {
    header: "Account Registration",
    body: {
      text: "Each organization is registered as a separate tenant within the system. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
    },
  },
  {
    header: "Free Trial",
    body: {
      text: "LEKOTA provides a 10-day free trial period for new tenant organizations. During this period, all features are accessible without payment. At the end of the trial period, continued access to core features requires an active subscription.",
    },
  },
  {
    header: "Subscription & Billing",
    body: {
      text: "Access to LEKOTA beyond the trial period requires a valid subscription. Subscription fees, billing cycles, and payment terms are communicated during the subscription process. Failure to complete payment may result in restricted access to scheduling and administrative features.",
    },
  },
  {
    header: "Use of the Platform",
    body: {
      text: "You agree to use LEKOTA only for lawful purposes and in accordance with these terms.",
      content: {
        header: "You shall not:",
        list: [
          "Attempt to access data belonging to other tenants",
          "Interfere with system security or performance",
          "Use the platform for fraudulent or harmful activities",
        ],
      },
    },
  },
  {
    header: "Data Ownership & Tenant Isolation",
    body: {
      text: "Each tenant retains ownership of its data. LEKOTA enforces strict tenant-level data isolation to ensure that organizational data is not accessible to other users or tenants.",
    },
  },
  {
    header: "Payment Processing",
    body: {
      text: "LEKOTA integrates third-party payment providers to process transactions. By using payment features, you agree to comply with the terms of the respective payment provider. LEKOTA does not store sensitive payment card details.",
    },
  },
  {
    header: "System Availability",
    body: {
      text: "We strive to ensure continuous platform availability but do not guarantee uninterrupted access. Maintenance, updates, or unforeseen issues may result in temporary service disruptions.",
    },
  },
  {
    header: "Termination",
    body: {
      text: "We reserve the right to suspend or terminate access to the platform if these terms are violated or if misuse is detected. Tenants may discontinue use at any time.",
    },
  },
  {
    header: "Limitation of Liability",
    body: {
      text: "LEKOTA shall not be liable for indirect, incidental, or consequential damages arising from the use or inability to use the platform.",
    },
  },
  {
    header: "Changes to Terms",
    body: {
      text: "We may update these Terms of Service from time to time. Continued use of the platform constitutes acceptance of any updates.",
    },
  },
  {
    header: "Contact",
    body: {
      text: "For questions regarding these terms, please contact support through the platform.",
    },
  },
];

const privacy_policy = [
  {
    header: "Introduction",
    body: {
      text: "LEKOTA is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use the platform.",
    },
  },
  {
    header: "Information We Collect",
    body: {
      deep: [
        {
          header: "Account Information",
          list: [
            "Name",
            "Email address",
            "Phone number",
            "Organization details",
          ],
        },
        {
          header: "Scheduling Data",
          list: [
            "Appointment details",
            "Service information",
            "Practitioner assignments",
          ],
        },
        {
          header: "Payment Information",
          list: [
            "Payment transactions are processed securely through third-party providers. LEKOTA does not store sensitive card details.",
          ],
        },
      ],
    },
  },
  {
    header: "How We Use Information",
    body: {
      content: {
        header: "We use collected data to:",
        list: [
          "Provide and manage scheduling services",
          "Process payments and transactions",
          "Improve system performance and user experience",
          "Generate analytics and reports",
          "Communicate important updates and notifications",
        ],
      },
    },
  },
  {
    header: "Data Security",
    body: {
      text: "We implement security measures to protect your data.",
      content: {
        header: "These include:",
        list: [
          "Encrypted authentication (JWT)",
          "Password hashing (bcrypt)",
          "Tenant-level data isolation",
        ],
      },
    },
  },
  {
    header: "Data Sharing",
    body: {
      text: "We do not sell or rent user data.",
      content: {
        header: "Data may only be shared:",
        list: [
          "With payment providers for transaction processing",
          "When required by law or legal obligations",
        ],
      },
    },
  },
  {
    header: "Data Retention",
    body: {
      text: "We retain data for as long as necessary to provide services and comply with legal obligations. Organizations may request data deletion where applicable.",
    },
  },
  {
    header: "User Rights",
    body: {
      content: {
        header: "Users have the right to:",
        list: [
          "Access their personal data",
          "Request corrections",
          "Request deletion of their data",
        ],
      },
      text: "Requests can be made through the platform or support channels.",
    },
  },
  {
    header: "Cookies & Tracking",
    body: {
      text: "LEKOTA may use cookies or similar technologies to improve user experience and monitor system performance.",
    },
  },
  {
    header: "Third-Party Services",
    body: {
      text: "LEKOTA integrates third-party services (e.g., payment gateways). These services operate under their own privacy policies.",
    },
  },
  {
    header: "Changes to This Policy",
    body: {
      text: "We may update this Privacy Policy periodically. Continued use of the platform indicates acceptance of any changes.",
    },
  },
  {
    header: "Contact",
    body: {
      text: "For privacy-related inquiries, please contact support.",
    },
  },
];

const Legal = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "contain",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full flex flex-col items-center justify-center text-sm sm:text-base"
      >
        <div className="w-6xl max-w-full flex flex-col items-center gap-16 px-5 pt-52 pb-20">
          <h1 className="text-3xl sm:text-5xl font-medium leading-none tracking-[-4%]">
            Terms of Service
          </h1>
          <div className="flex flex-col gap-8">
            <p className="sm:text-lg">Last updated: March 2026</p>

            <div className="flex flex-col gap-5">
              {terms_of_service.map((term, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span>{i + 1}.</span>
                    <h3>{term.header}</h3>
                  </div>
                  <div>
                    <p>{term.body.text}</p>
                    <div>
                      <p>{term.body?.content?.header}</p>
                      <ul className="list-disc px-8">
                        {term.body.content?.list.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-6xl max-w-full flex flex-col items-center gap-16 py-20 px-5 text-sm sm:text-base">
        <div className="flex flex-col items-center gap-16">
          <h1 className="text-3xl sm:text-5xl font-medium leading-none tracking-[-4%]">
            Privacy Policy
          </h1>
          <div className="flex flex-col gap-8">
            <p className="sm:text-lg">Last updated: March 2026</p>

            <div className="w-full max-w-4xl flex flex-col gap-5">
              {privacy_policy.map((policy, i) => (
                <div key={i} className="flex flex-col gap-1">
                  {/* HEADER */}
                  <div className="flex items-start gap-1">
                    <span>{i + 1}.</span>
                    <h3>{policy.header}</h3>
                  </div>

                  {/* BODY */}
                  <div>
                    {/* TEXT */}
                    {policy.body?.text && <p>{policy.body.text}</p>}

                    {/* CONTENT (header + list) */}
                    {policy.body?.content && (
                      <div className="flex flex-col gap-1">
                        <p>
                          {policy.body.content.header}
                        </p>
                        <ul className="list-disc pl-8">
                          {policy.body.content.list?.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* DEEP (multiple sections with lists) */}
                    {policy.body?.deep && (
                      <div className="flex flex-col gap-3">
                        {policy.body.deep.map((section, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <p>{section.header}</p>
                            <ul className="list-disc pl-8">
                              {section.list?.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Legal;
