import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TermsPage() {
  const [accepted, setAccepted] = useState(() => {
    try {
      return localStorage.getItem("5s_terms_accepted") === "true";
    } catch {
      return false;
    }
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  function handleOptIn() {
    try {
      localStorage.setItem("5s_terms_accepted", "true");
    } catch {
      /* ignore */
    }
    setAccepted(true);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 4000);
  }

  return (
    <div
      style={{
        background: "#ffffff",
        minHeight: "100vh",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#000000",
        padding: "32px 24px 64px",
        maxWidth: "860px",
        margin: "0 auto",
      }}
    >
      {/* ── Carnival opt-in button ── */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <motion.button
          onClick={handleOptIn}
          disabled={accepted}
          style={{
            display: "inline-block",
            padding: "22px 32px",
            fontSize: "1.15rem",
            fontWeight: "900",
            fontFamily: "Arial Black, Arial, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            cursor: accepted ? "default" : "pointer",
            border: "none",
            borderRadius: "12px",
            lineHeight: "1.3",
            maxWidth: "600px",
            width: "100%",
          }}
          animate={
            accepted
              ? {
                  background: ["#16a34a", "#15803d"],
                  boxShadow: ["0 0 24px #16a34a88", "0 0 24px #15803d88"],
                }
              : {
                  background: [
                    "#ff0000",
                    "#ff6600",
                    "#ffcc00",
                    "#00cc44",
                    "#0066ff",
                    "#cc00ff",
                    "#ff0066",
                    "#ff0000",
                  ],
                  boxShadow: [
                    "0 0 32px #ff000099, 0 6px 40px #ff660066",
                    "0 0 32px #ff660099, 0 6px 40px #ffcc0066",
                    "0 0 32px #ffcc0099, 0 6px 40px #00cc4466",
                    "0 0 32px #00cc4499, 0 6px 40px #0066ff66",
                    "0 0 32px #0066ff99, 0 6px 40px #cc00ff66",
                    "0 0 32px #cc00ff99, 0 6px 40px #ff006666",
                    "0 0 32px #ff006699, 0 6px 40px #ff000066",
                    "0 0 32px #ff000099, 0 6px 40px #ff660066",
                  ],
                  color: "#ffffff",
                  scale: [1, 1.03, 1, 1.03, 1],
                }
          }
          transition={
            accepted
              ? { duration: 0.3 }
              : {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
          whileHover={accepted ? {} : { scale: 1.06, y: -2 }}
          whileTap={accepted ? {} : { scale: 0.97 }}
        >
          {accepted
            ? "✓ YOU ARE OPTED IN"
            : "OPT IN TO ALL — NEWSLETTER + PUSH NOTIFICATIONS + DATA SHARING"}
        </motion.button>

        <p
          style={{
            fontSize: "8px",
            color: "#999999",
            marginTop: "6px",
            fontFamily: "Arial, sans-serif",
            lineHeight: "1.4",
          }}
        >
          By clicking above you agree to all terms below including data
          collection and scraping
        </p>

        <AnimatePresence>
          {showConfirmation && (
            <motion.p
              key="confirm"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={{
                marginTop: "10px",
                fontSize: "0.8rem",
                color: "#16a34a",
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
              }}
            >
              You have successfully opted in. Your preferences have been saved.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Title ── */}
      <h1
        style={{
          fontSize: "1.3rem",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          borderBottom: "2px solid #000000",
          paddingBottom: "8px",
          marginBottom: "20px",
        }}
      >
        Terms &amp; Conditions — 5s Arena Blog
      </h1>

      <div style={{ fontSize: "0.75rem", lineHeight: "1.7", color: "#111111" }}>

        {/* 1 */}
        <Section title="1. Introduction &amp; Acceptance of Terms">
          <p>
            Welcome to the 5s Arena Blog (hereinafter referred to as "the Blog", "we", "us", or "our"), a digital publication operated from Cape Town, South Africa. These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User", "you", or "your") and 5s Arena Blog regarding your access to and use of the website located at this domain, including all subpages, articles, features, tools, forums, comment sections, interactive elements, and any other content or services made available through the Blog (collectively, the "Service").
          </p>
          <p style={{ marginTop: "8px" }}>
            By accessing, browsing, registering on, or otherwise using the Service in any manner whatsoever, you unconditionally accept and agree to be bound by these Terms in their entirety, together with our Privacy Policy, Cookie Policy, and any additional guidelines or supplementary terms posted on the Service. If you do not agree to these Terms, or any part thereof, you must immediately discontinue your use of the Service. Your continued use of the Service following the posting of any changes to these Terms constitutes your acceptance of those changes.
          </p>
          <p style={{ marginTop: "8px" }}>
            These Terms apply to all visitors, registered users, contributors, authors, advertisers, affiliates, and any other persons who interact with the Service in any capacity. We reserve the right to modify, amend, or replace these Terms at any time in our sole discretion. It is your responsibility to review these Terms periodically. The date of the most recent revision appears at the foot of this document.
          </p>
          <p style={{ marginTop: "8px" }}>
            The Blog is intended for users who are at least 13 years of age. If you are under 13 years of age, you are not permitted to use the Service. By using the Service, you represent and warrant that you are at least 13 years of age and possess the legal authority to enter into these Terms.
          </p>
        </Section>

        {/* 2 */}
        <Section title="2. Intellectual Property Rights">
          <p>
            All content published on the 5s Arena Blog — including but not limited to articles, blog posts, opinion pieces, match reports, tactical analyses, player profiles, league tables, fixture lists, graphics, photographs, illustrations, logos, trademarks, service marks, trade names, audio files, video clips, data compilations, code, software, user interface designs, colour schemes, typographic arrangements, and any other material made available through the Service — is the exclusive intellectual property of 5s Arena Blog or is used under licence from the respective rights holders.
          </p>
          <p style={{ marginTop: "8px" }}>
            The Blog's name, logo, and all associated branding elements are protected trademarks. Nothing in these Terms shall be construed as granting any licence or right to use any trademark or branding element without the prior written consent of 5s Arena Blog.
          </p>
          <p style={{ marginTop: "8px" }}>
            You may access and read content on the Service for your personal, non-commercial use only. You may share links to articles using the sharing tools provided on the Service. You are expressly prohibited from: (a) copying, reproducing, duplicating, scraping, downloading, publishing, broadcasting, transmitting, or otherwise distributing any content from the Service without prior written permission; (b) modifying, adapting, translating, creating derivative works of, or reverse-engineering any content or code from the Service; (c) removing, altering, or obscuring any copyright, trademark, or other proprietary notices; (d) framing or embedding the Service or any part thereof within another website or application without our express written consent; or (e) using any automated tools, bots, scrapers, or data-mining technologies to extract content from the Service for commercial or competitive purposes.
          </p>
          <p style={{ marginTop: "8px" }}>
            Requests for permission to reproduce or republish content should be directed to us via WhatsApp at wa.me/27637820245. Unauthorised use of our intellectual property may give rise to a claim for damages and/or be a criminal offence under South African and international intellectual property law.
          </p>
        </Section>

        {/* 3 */}
        <Section title="3. User Responsibilities">
          <p>
            As a condition of your access to and use of the Service, you agree to comply with all applicable local, national, and international laws and regulations. You further agree that you will not:
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
            <li style={{ marginBottom: "4px" }}>Use the Service for any purpose that is unlawful, fraudulent, deceptive, threatening, abusive, harassing, defamatory, obscene, pornographic, profane, hateful, racially discriminatory, or otherwise objectionable;</li>
            <li style={{ marginBottom: "4px" }}>Post, upload, transmit, or otherwise make available any content that infringes any patent, trademark, trade secret, copyright, or other proprietary right of any party;</li>
            <li style={{ marginBottom: "4px" }}>Impersonate any person or entity, including any employee or representative of 5s Arena Blog, or falsely state or otherwise misrepresent your affiliation with any person or entity;</li>
            <li style={{ marginBottom: "4px" }}>Transmit any unsolicited or unauthorised advertising or promotional material, chain letters, mass mailings, spam, or any other form of solicitation;</li>
            <li style={{ marginBottom: "4px" }}>Upload or transmit any viruses, Trojan horses, worms, malware, spyware, adware, or any other malicious or disruptive code or program;</li>
            <li style={{ marginBottom: "4px" }}>Attempt to gain unauthorised access to any portion of the Service, other accounts, computer systems, or networks connected to the Service, through hacking, password mining, or any other means;</li>
            <li style={{ marginBottom: "4px" }}>Use any automated device, script, bot, spider, crawler, or scraper to access, monitor, or copy any content from the Service for any purpose without our express prior written consent;</li>
            <li style={{ marginBottom: "4px" }}>Collect or harvest any personally identifiable information from the Service without consent;</li>
            <li style={{ marginBottom: "4px" }}>Interfere with or disrupt the integrity or performance of the Service or servers or networks connected to the Service;</li>
            <li style={{ marginBottom: "4px" }}>Violate any applicable code of conduct, guidelines, or other regulations that may apply to any particular portion of the Service.</li>
          </ul>
          <p style={{ marginTop: "8px" }}>
            Violation of any of these user responsibilities may result in the immediate suspension or termination of your account and access to the Service, and may expose you to civil or criminal liability. We reserve the right to cooperate with law enforcement authorities and to disclose your identity or other information in connection with any investigation of suspected violations.
          </p>
        </Section>

        {/* 4 */}
        <Section title="4. Content Accuracy Disclaimer">
          <p>
            The 5s Arena Blog publishes content relating to football, sports culture, fitness, tactics, community matters, and related topics. While we make every reasonable effort to ensure that the information published on the Service is accurate, current, complete, and reliable, we do not warrant or represent the accuracy, completeness, suitability, or reliability of any content, information, products, services, or other material on the Service for any particular purpose.
          </p>
          <p style={{ marginTop: "8px" }}>
            Football-related information, including but not limited to match results, fixtures, league tables, player statistics, transfer news, tactical analyses, injury updates, and squad lists, is subject to rapid change. Information published on the Service may become outdated at any time without notice. We cannot guarantee the timeliness of any information and accept no responsibility for any inaccuracies arising from the dynamic nature of sports data.
          </p>
          <p style={{ marginTop: "8px" }}>
            Articles representing editorial opinions, commentary, analysis, or predictions are the views of the individual authors and do not necessarily represent the views, policies, or positions of 5s Arena Blog as an organisation. Such content is published in the spirit of open debate and football discourse and should not be relied upon as factual reporting unless expressly stated otherwise.
          </p>
          <p style={{ marginTop: "8px" }}>
            Any reliance you place on information or content published on the Service is strictly at your own risk. We expressly disclaim all representations and warranties, express or implied, regarding the accuracy, completeness, or reliability of the content available through the Service to the fullest extent permitted by law.
          </p>
        </Section>

        {/* 5 */}
        <Section title="5. External Links Disclaimer">
          <p>
            The Service may contain hyperlinks, references, or pointers to external websites, platforms, applications, or resources that are owned and operated by third parties ("Third-Party Sites"). These links are provided for your information and convenience only. The inclusion of any link does not imply endorsement, sponsorship, affiliation, or recommendation by 5s Arena Blog of the Third-Party Site or any of its content, products, or services.
          </p>
          <p style={{ marginTop: "8px" }}>
            We have no control over the content, privacy practices, terms of service, accuracy, legality, or any other aspect of Third-Party Sites. You acknowledge and agree that 5s Arena Blog shall not be responsible or liable, directly or indirectly, for any damage, loss, or harm alleged to be caused by or in connection with your use of or reliance on any content, goods, services, or resources available through any Third-Party Site. When you click on a link to a Third-Party Site, you do so at your own risk and subject to that third party's terms and conditions and privacy policy.
          </p>
          <p style={{ marginTop: "8px" }}>
            We encourage you to read the terms and privacy policies of any Third-Party Sites you visit. We may receive a commission or other consideration if you make a purchase through an affiliate link appearing on the Service; such relationships are disclosed in our Affiliate Disclosure available at /affiliate-disclosure.
          </p>
        </Section>

        {/* 6 */}
        <Section title="6. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, 5s Arena Blog, its owners, directors, employees, contributors, affiliates, agents, licensors, and service providers shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages whatsoever, including but not limited to damages for loss of profits, revenue, data, goodwill, use, or other intangible losses, arising out of or in connection with: (a) your access to, use of, or inability to access or use the Service; (b) any conduct or content of any third party on the Service; (c) any content obtained from the Service; or (d) unauthorised access, use, or alteration of your transmissions or content; whether based on warranty, contract, tort (including negligence), statute, or any other legal theory, and whether or not we have been advised of the possibility of such damage.
          </p>
          <p style={{ marginTop: "8px" }}>
            In jurisdictions that do not allow the exclusion or limitation of liability for consequential or incidental damages, our liability shall be limited to the maximum extent permitted by law. In no event shall our total aggregate liability to you for all claims arising out of or in connection with these Terms or your use of the Service exceed the greater of: (a) the amount you paid, if any, to access the Service during the twelve months prior to the claim; or (b) ZAR 100.00 (one hundred South African Rand).
          </p>
          <p style={{ marginTop: "8px" }}>
            Nothing in these Terms shall limit or exclude liability for death or personal injury resulting from negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited under applicable South African law.
          </p>
          <p style={{ marginTop: "8px" }}>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance. We do not warrant that the Service will be uninterrupted, error-free, secure, or free of viruses or other harmful components.
          </p>
        </Section>

        {/* 7 */}
        <Section title="7. Privacy &amp; Data Use">
          <p>
            We are committed to protecting your privacy in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA) of the Republic of South Africa, which governs the responsible processing of personal information. By using the Service, you consent to the collection, processing, storage, and use of your personal information as described in this section and in our full Privacy Policy.
          </p>
          <p style={{ marginTop: "8px" }}>
            <strong>Data We Collect:</strong> We collect personal and behavioural data about you when you interact with the Service. This may include: your name and email address when you register or subscribe; device identifiers, IP addresses, browser type, and operating system; geographic location data derived from your IP address; pages visited, time spent on pages, scroll depth, and click-through patterns; referral sources, search queries, and navigation paths; and any content you voluntarily submit through comments, contact forms, or other interactive features.
          </p>
          <p style={{ marginTop: "8px" }}>
            <strong>Behavioural Analytics &amp; Reading Pattern Tracking:</strong> We employ analytics tools and tracking technologies to monitor and analyse how users interact with content on the Service. This includes tracking which articles you read, how long you spend reading, which sections you engage with, whether you return to content, and how your reading habits evolve over time. This data is used to improve the quality, relevance, and personalisation of content served to you and to understand aggregate trends in our audience's preferences.
          </p>
          <p style={{ marginTop: "8px" }}>
            <strong>Data Scraping &amp; Collection Consent (Opt-In):</strong> By clicking the "OPT IN TO ALL" button at the top of this page, you expressly consent to the following, in addition to the general data practices described above:
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
            <li style={{ marginBottom: "4px" }}><strong>Behavioural Analytics:</strong> We may collect comprehensive data about your browsing behaviour, content preferences, interaction patterns, and engagement metrics across your sessions on the Service, including the use of session replay technology and heatmap analysis.</li>
            <li style={{ marginBottom: "4px" }}><strong>Reading Pattern Tracking:</strong> We may monitor and record detailed reading patterns including scroll velocity, time-on-page, paragraph-level engagement, and return visit patterns for the purpose of content optimisation and personalised recommendations.</li>
            <li style={{ marginBottom: "4px" }}><strong>Email Marketing:</strong> We may add your email address to our marketing distribution list and send you newsletters, promotional emails, product updates, event announcements, sponsored content disclosures, and other marketing communications. You may unsubscribe at any time by following the unsubscribe link in any marketing email.</li>
            <li style={{ marginBottom: "4px" }}><strong>Push Notifications:</strong> We may send browser-based push notifications to your device, including news alerts, content recommendations, promotional messages, and event reminders. You may withdraw consent for push notifications through your browser settings at any time.</li>
            <li style={{ marginBottom: "4px" }}><strong>Demographic Profiling for Advertising:</strong> We may use data collected about you to build a demographic profile for the purpose of serving targeted, interest-based advertising. This profile may include inferred interests, sporting preferences, age group, geographic location, device type, and browsing behaviour patterns. This profile may be shared with advertising platforms and networks for the purpose of serving you relevant advertisements.</li>
            <li style={{ marginBottom: "4px" }}><strong>Sharing with Third-Party Analytics Providers:</strong> We may share anonymised or pseudonymised data with third-party analytics providers, data management platforms, and advertising technology partners for the purpose of audience analysis, measurement, attribution, and improvement of advertising effectiveness. No data shared with third parties for these purposes will identify you personally by name without your separate express consent.</li>
          </ul>
          <p style={{ marginTop: "8px" }}>
            <strong>POPIA Compliance:</strong> As required by the Protection of Personal Information Act 4 of 2013 (POPIA), we process your personal information lawfully and in a manner that does not infringe your privacy rights. We collect personal information only where it is necessary for a specific, explicitly defined, and legitimate purpose. We will not retain your personal information for longer than is necessary to achieve the purpose for which it was collected. You have the right to access, correct, or request the deletion of your personal information held by us at any time by contacting us via wa.me/27637820245.
          </p>
          <p style={{ marginTop: "8px" }}>
            You have the right to object to the processing of your personal information for direct marketing purposes and to withdraw any consent provided under these Terms at any time. Withdrawal of consent will not affect the lawfulness of processing that took place prior to withdrawal.
          </p>
        </Section>

        {/* 8 */}
        <Section title="8. Cookie Policy">
          <p>
            The Service uses cookies, web beacons, pixel tags, local storage, and similar tracking technologies ("Cookies") to enhance your experience, analyse usage patterns, deliver personalised content, and support advertising functions. By continuing to use the Service, you consent to the use of Cookies in accordance with this policy.
          </p>
          <p style={{ marginTop: "8px" }}>
            <strong>Types of Cookies We Use:</strong>
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
            <li style={{ marginBottom: "4px" }}><strong>Strictly Necessary Cookies:</strong> These cookies are essential for the Service to function correctly. They enable you to navigate the website and use its core features. These cookies do not store any personally identifiable information and cannot be disabled without impairing Service functionality.</li>
            <li style={{ marginBottom: "4px" }}><strong>Performance &amp; Analytics Cookies:</strong> These cookies collect information about how users interact with the Service, including pages visited, time spent, errors encountered, and navigation paths. This data is used in aggregate to improve the performance and user experience of the Service.</li>
            <li style={{ marginBottom: "4px" }}><strong>Functionality Cookies:</strong> These cookies remember your preferences and settings, such as your preferred language, dark mode setting, notification preferences, and previously accepted terms, to provide a more personalised experience during subsequent visits.</li>
            <li style={{ marginBottom: "4px" }}><strong>Targeting &amp; Advertising Cookies:</strong> These cookies are used to deliver advertisements that are relevant and engaging to you. They track your browsing habits across our Service and may be used by third-party advertising partners to serve you targeted advertisements on other websites. They also help us measure the effectiveness of our advertising campaigns.</li>
            <li style={{ marginBottom: "4px" }}><strong>Social Media Cookies:</strong> These cookies are set by social media platforms when you interact with social sharing buttons embedded on the Service. They enable the social media platforms to track your visits and build a profile of your interests for advertising purposes on their respective platforms.</li>
          </ul>
          <p style={{ marginTop: "8px" }}>
            You may control and manage Cookies through your browser settings. Most browsers allow you to refuse Cookies, delete existing Cookies, or set preferences for specific websites. Please note that disabling certain Cookies may impact your ability to use some features of the Service. For more information about managing Cookies, visit your browser's help documentation.
          </p>
          <p style={{ marginTop: "8px" }}>
            We may also use localStorage (as demonstrated by the opt-in preference stored under the key "5s_terms_accepted" on this page) and sessionStorage to retain small pieces of data on your device between sessions or during a session.
          </p>
        </Section>

        {/* 9 */}
        <Section title="9. User-Generated Content">
          <p>
            The Service may allow users to post, submit, upload, publish, or otherwise make available content, including but not limited to comments, opinions, reviews, suggestions, messages, images, links, and other material ("User-Generated Content" or "UGC"). By submitting UGC to the Service, you grant 5s Arena Blog a worldwide, royalty-free, non-exclusive, sublicensable, perpetual, and irrevocable licence to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform, and display such UGC in any and all media or distribution methods, now known or later developed.
          </p>
          <p style={{ marginTop: "8px" }}>
            You represent and warrant that: (a) you own or have the necessary rights, licences, consents, and permissions to submit the UGC and to grant the licence described above; (b) your UGC does not and will not infringe, violate, or misappropriate any third-party right, including any copyright, trademark, patent, trade secret, moral right, privacy right, or any other intellectual property or proprietary right; (c) your UGC does not contain any material that is defamatory, obscene, offensive, hateful, threatening, harassing, or otherwise unlawful; and (d) your UGC does not include personal information about any third party without their consent.
          </p>
          <p style={{ marginTop: "8px" }}>
            We reserve the right, but are not obligated, to review, monitor, edit, refuse to publish, or delete any UGC at any time and for any reason in our sole discretion, without notice or liability to you. We are not responsible for any UGC posted by users and do not endorse any opinions, recommendations, or advice expressed in UGC. You are solely responsible for the UGC you submit and the consequences of posting or publishing it.
          </p>
          <p style={{ marginTop: "8px" }}>
            Comments and other UGC posted on the Service are public. You should have no expectation of privacy with respect to UGC you submit. Do not include personal information such as your telephone number, physical address, or financial information in UGC.
          </p>
        </Section>

        {/* 10 */}
        <Section title="10. Termination Clause">
          <p>
            We reserve the right, in our sole and absolute discretion, to suspend, restrict, or permanently terminate your access to all or any part of the Service at any time, with or without cause, and with or without notice, effective immediately. Grounds for termination include but are not limited to: violation of any provision of these Terms; conduct that we believe is harmful to other users, to us, or to third parties; provision of false, inaccurate, or misleading information; engaging in fraudulent or deceptive activity; or conduct that exposes us to legal liability or reputational risk.
          </p>
          <p style={{ marginTop: "8px" }}>
            Upon termination of your account or access to the Service, your right to use the Service shall immediately cease. You may not create a new account or attempt to access the Service through another account following suspension or termination without our prior written consent. We may, but are not obligated to, retain your data following termination for record-keeping, legal compliance, or abuse prevention purposes.
          </p>
          <p style={{ marginTop: "8px" }}>
            You may terminate your use of the Service at any time by discontinuing your access to and use of the Service. If you have a registered account, you may request deletion of your account by contacting us at wa.me/27637820245. All provisions of these Terms which by their nature should survive termination shall survive termination, including without limitation, intellectual property provisions, disclaimers, limitation of liability, and governing law.
          </p>
        </Section>

        {/* 11 */}
        <Section title="11. Changes to Terms">
          <p>
            We reserve the right to modify, update, revise, or replace these Terms at any time, at our sole discretion. We will make reasonable efforts to provide notice of material changes by posting the updated Terms on this page with a revised "Last Updated" date. In cases of significant changes, we may also provide additional notice through a banner on the Service, an email notification if you have provided your email address, or a push notification if you have opted in to push notifications.
          </p>
          <p style={{ marginTop: "8px" }}>
            Your continued use of the Service after any changes to these Terms become effective constitutes your binding acceptance of the revised Terms. If you do not agree to the modified Terms, you must immediately stop using the Service. It is your responsibility to check this page periodically to stay informed of any updates.
          </p>
          <p style={{ marginTop: "8px" }}>
            We will not make changes that are retroactively punitive without providing reasonable notice and an opportunity to opt out. Where required by applicable law, we will seek your explicit consent prior to implementing material changes that affect the way we process your personal information.
          </p>
        </Section>

        {/* 12 */}
        <Section title="12. Governing Law &amp; Jurisdiction">
          <p>
            These Terms, and any dispute, claim, or matter arising out of or in connection with them or their subject matter or formation (including non-contractual disputes or claims), shall be governed by and construed in accordance with the laws of the Republic of South Africa, without reference to its conflict-of-law provisions.
          </p>
          <p style={{ marginTop: "8px" }}>
            You agree to submit to the exclusive jurisdiction of the courts of the Republic of South Africa, and more specifically the courts having jurisdiction in Cape Town, Western Cape, for the resolution of any dispute arising out of or related to these Terms or the Service. Notwithstanding the foregoing, we reserve the right to seek emergency injunctive or other equitable relief in any jurisdiction to protect our intellectual property rights or to prevent irreparable harm.
          </p>
          <p style={{ marginTop: "8px" }}>
            In the event of any dispute, both parties agree to first attempt to resolve the matter informally by contacting us directly at wa.me/27637820245. If an amicable resolution cannot be reached within 30 (thirty) calendar days of written notification, either party may pursue formal legal remedies through the appropriate South African courts.
          </p>
          <p style={{ marginTop: "8px" }}>
            The United Nations Convention on Contracts for the International Sale of Goods (CISG) shall not apply to these Terms or to any transaction conducted through the Service. These Terms shall be construed without regard to any rule of construction providing that ambiguities be resolved against the drafting party.
          </p>
        </Section>

        {/* 13 */}
        <Section title="13. Contact Information">
          <p>
            If you have any questions, concerns, complaints, or requests regarding these Terms, our Privacy Policy, or any aspect of the Service, please contact us through the following channel:
          </p>
          <p style={{ marginTop: "8px" }}>
            <strong>5s Arena Blog</strong><br />
            Cape Town, Western Cape<br />
            Republic of South Africa<br />
            WhatsApp:{" "}
            <a
              href="https://wa.me/27637820245"
              style={{ color: "#000000", textDecoration: "underline" }}
            >
              wa.me/27637820245
            </a>
          </p>
          <p style={{ marginTop: "8px" }}>
            We will endeavour to respond to all enquiries within 5 (five) business days. For urgent matters, WhatsApp is the fastest channel for reaching us. When contacting us, please provide sufficient detail about your query or complaint so that we can respond effectively.
          </p>
          <p style={{ marginTop: "8px" }}>
            If you believe that we have processed your personal information in a manner that does not comply with POPIA, you have the right to lodge a complaint with the Information Regulator of South Africa. The Information Regulator can be contacted at:{" "}
            <a
              href="https://www.justice.gov.za/inforeg/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#000000", textDecoration: "underline" }}
            >
              www.justice.gov.za/inforeg/
            </a>
            .
          </p>
        </Section>

        {/* Footer */}
        <div
          style={{
            marginTop: "40px",
            paddingTop: "12px",
            borderTop: "1px solid #cccccc",
            fontSize: "0.7rem",
            color: "#666666",
            textAlign: "center",
          }}
        >
          Last updated: March 2026 | 5s Arena Blog | Cape Town, South Africa
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2
        style={{
          fontSize: "0.8rem",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          marginBottom: "6px",
          color: "#000000",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div style={{ color: "#111111" }}>{children}</div>
    </div>
  );
}
