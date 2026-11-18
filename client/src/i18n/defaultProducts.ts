import { language } from './index';

// Match the default catalog text exactly so edited or custom copy keeps its original wording.
const defaultProductText = new Map<string, string>([
  ["Webbpacket", "Website package"],
  ["En komplett webbplats anpassad efter ditt företags behov.", "A complete website tailored to your business needs."],
  ["Marknadsföringspaket", "Marketing package"],
  ["Strategisk digital marknadsföring för att effektivt nå din målgrupp.", "Digital marketing to reach the right audience for your business."],
  ["Varumärkespaket", "Brand identity package"],
  ["Komplett visuell identitet inklusive logotypdesign och färgpaletter.", "A complete visual identity including logo design and color palettes."],
  ["Applikationspaket", "Application package"],
  ["Anpassad webbapplikationer byggda med moderna ramverk för skalbarhet.", "A custom web application built with modern frameworks so it can grow with your business."],
  ["Helhetspaket", "Full-service package"],
  ["Den ultimata lösningen som inkluderar webbplats, marknadsföring och varumärkestjänster.", "A website, digital marketing and branding in one package."],
]);

export function translateDefaultProductText(text: string): string {
  return language.value === 'en' ? (defaultProductText.get(text) ?? text) : text;
}
