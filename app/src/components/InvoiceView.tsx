import { useState, useRef } from 'react';
import type { InvoiceData, InvoiceSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, FileText, PoundSterling, Calculator, Sparkles } from 'lucide-react';
import { format } from '@/lib/utils';

interface InvoiceViewProps {
  invoice: InvoiceData;
  settings: InvoiceSettings;
  onCompletePeriod: () => void;
  accentHue: string;
}

export function InvoiceView({ invoice, settings, onCompletePeriod, accentHue }: InvoiceViewProps) {
  const [copied, setCopied] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const generateInvoiceText = (): string => {
    const lines: string[] = [];
    
    lines.push(`${settings.contractorName}`);
    lines.push(`${settings.contractorAddress}`);
    lines.push(`Phone: ${settings.contractorPhone}`);
    lines.push(`Email: ${settings.contractorEmail || '[Your Email]'}`);
    lines.push(`UTR Number: ${settings.utrNumber}`);
    lines.push('');
    lines.push(`Date: ${format(new Date(), 'dd/MM/yyyy')}`);
    lines.push(`Invoice Number: ${invoice.invoiceNumber}`);
    lines.push('');
    lines.push(`To: ${settings.clientName}`);
    if (settings.clientAddress) lines.push(settings.clientAddress);
    if (settings.clientContact) lines.push(settings.clientContact);
    lines.push('');
    lines.push('Invoice Details');
    lines.push('Description of Work | Date(s) | Amount (£)');
    lines.push('');
    
    invoice.entries.forEach((entry) => {
      const desc = `Labour – ${entry.tasks} at ${entry.location}`;
      const date = format(new Date(entry.date), 'dd/MM/yyyy');
      lines.push(`${desc} | ${date} | ${entry.amount.toFixed(2)}`);
    });
    
    lines.push('');
    lines.push(`Subtotal: £${invoice.subtotal.toFixed(2)}`);
    
    if (settings.cisRate > 0) {
      lines.push(`Less: CIS deduction (${settings.cisRate}%) £${invoice.cisDeduction.toFixed(2)}`);
    }
    
    lines.push(`Total Payable: £${invoice.totalPayable.toFixed(2)}`);
    lines.push('');
    lines.push('Bank Details for Payment');
    lines.push(`Account Name: ${settings.bankAccountName}`);
    lines.push(`Sort Code: ${settings.sortCode}`);
    lines.push(`Account Number: ${settings.accountNumber}`);
    lines.push('');
    lines.push('Please make payment to the above account within 7 days of invoice date.');
    lines.push('');
    lines.push('Thank you for your business!');
    
    return lines.join('\n');
  };

  const handleCopy = async () => {
    const text = generateInvoiceText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const hasEntries = invoice.entries.length > 0;

  if (!hasEntries) {
    return (
      <Card className="w-full glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 font-semibold tracking-tight">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `hsl(${accentHue} 90% 58% / 0.2)` }}
            >
              <FileText className="w-4 h-4" style={{ color: `hsl(${accentHue} 90% 58%)` }} />
            </div>
            Invoice Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No entries selected for invoice</p>
            <p className="text-xs mt-1 opacity-60">Select weeks to generate an invoice</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between font-semibold tracking-tight">
          <span className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `hsl(${accentHue} 90% 58% / 0.2)` }}
            >
              <FileText className="w-4 h-4" style={{ color: `hsl(${accentHue} 90% 58%)` }} />
            </div>
            Invoice Preview
          </span>
          <span className="text-sm font-normal text-gold font-mono">
            #{invoice.invoiceNumber}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          ref={invoiceRef}
          className="bg-zinc-100 text-zinc-900 p-4 rounded-xl text-sm font-mono whitespace-pre-wrap border border-zinc-300 shadow-inner"
        >
          <div className="font-bold">{settings.contractorName}</div>
          <div>{settings.contractorAddress}</div>
          <div>Phone: {settings.contractorPhone}</div>
          <div>Email: {settings.contractorEmail || '[Your Email]'}</div>
          <div>UTR Number: {settings.utrNumber}</div>
          <div className="mt-2">Date: {format(new Date(), 'dd/MM/yyyy')}</div>
          <div>Invoice Number: {invoice.invoiceNumber}</div>
          <div className="mt-2">To: {settings.clientName}</div>
          {settings.clientAddress && <div>{settings.clientAddress}</div>}
          {settings.clientContact && <div>{settings.clientContact}</div>}
          <div className="mt-3 font-bold">Invoice Details</div>
          <div className="border-b border-zinc-400 my-1">Description of Work | Date(s) | Amount (£)</div>
          {invoice.entries.map((entry) => (
            <div key={entry.id} className="py-1">
              Labour – {entry.tasks} at {entry.location} | {format(new Date(entry.date), 'dd/MM/yyyy')} | £{entry.amount.toFixed(2)}
            </div>
          ))}
          <div className="border-t border-zinc-400 mt-2 pt-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>£{invoice.subtotal.toFixed(2)}</span>
            </div>
            {settings.cisRate > 0 && (
              <div className="flex justify-between">
                <span>Less: CIS deduction ({settings.cisRate}%):</span>
                <span>£{invoice.cisDeduction.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>Total Payable:</span>
              <span>£{invoice.totalPayable.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-bold">Bank Details for Payment</div>
            <div>Account Name: {settings.bankAccountName}</div>
            <div>Sort Code: {settings.sortCode}</div>
            <div>Account Number: {settings.accountNumber}</div>
          </div>
          <div className="mt-2 text-xs text-zinc-600">
            Please make payment to the above account within 7 days of invoice date.
          </div>
          <div className="mt-2">Thank you for your business!</div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            className="flex-1 btn-glow"
            style={{ 
              background: copied 
                ? undefined 
                : `linear-gradient(to right, hsl(${accentHue} 90% 58%), hsl(${accentHue} 90% 48%))` 
            }}
            variant={copied ? 'secondary' : 'default'}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy for Email
              </>
            )}
          </Button>
        </div>

        <div className="border-t border-border/50 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium flex items-center gap-2 text-gold">
              <Calculator className="w-4 h-4" />
              Summary
            </span>
            <span className="text-xs text-muted-foreground">{invoice.periodLabel}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Hours:</span>
              <span>{invoice.totalHours.toFixed(2)} hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hourly Rate:</span>
              <span className="flex items-center gap-1">
                <PoundSterling className="w-3 h-3" />
                {settings.hourlyRate}/hr
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="text-gold">£{invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CIS Deduction ({settings.cisRate}%):</span>
              <span style={{ color: `hsl(${accentHue} 90% 58%)` }}>-£{invoice.cisDeduction.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-border/50 pt-2">
              <span>Total Payable:</span>
              <span className="text-gold">£{invoice.totalPayable.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={onCompletePeriod}
          variant="outline"
          className="w-full border-border/50 hover:bg-secondary/50"
        >
          <Sparkles className="w-4 h-4 mr-2 text-gold" />
          Complete & Clear Entries
        </Button>
      </CardContent>
    </Card>
  );
}
