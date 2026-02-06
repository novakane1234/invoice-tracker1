import { useState } from 'react';
import type { InvoiceSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, User, Building2, PoundSterling, CreditCard, Hash, ChevronDown, ChevronUp } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

interface SettingsPanelProps {
  settings: InvoiceSettings;
  onUpdateSettings: (settings: Partial<InvoiceSettings>) => void;
  invoiceNumber: number;
  onUpdateInvoiceNumber: (num: number) => void;
}

export function SettingsPanel({ settings, onUpdateSettings, invoiceNumber, onUpdateInvoiceNumber }: SettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  const [localInvoiceNum, setLocalInvoiceNum] = useState(invoiceNumber.toString());
  const [expandedSection, setExpandedSection] = useState<string | null>('contractor');

  const handleSave = () => {
    onUpdateSettings(localSettings);
    const num = parseInt(localInvoiceNum, 10);
    if (num > 0) {
      onUpdateInvoiceNumber(num);
    }
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setLocalInvoiceNum(invoiceNumber.toString());
    setIsExpanded(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const SectionHeader = ({ title, icon: Icon, section }: { title: string; icon: any; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-2 text-left"
    >
      <span className="text-sm font-medium flex items-center gap-2 text-gold">
        <Icon className="w-4 h-4" />
        {title}
      </span>
      {expandedSection === section ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
  );

  if (!isExpanded) {
    return (
      <Card className="w-full glass-card card-glow">
        <CardContent className="pt-4">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between hover:bg-secondary/50"
            onClick={() => setIsExpanded(true)}
          >
            <span className="flex items-center gap-2">
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `hsl(${settings.accentColor} 90% 58% / 0.2)` }}
              >
                <Settings className="w-4 h-4" style={{ color: `hsl(${settings.accentColor} 90% 58%)` }} />
              </div>
              <span className="font-medium">Settings</span>
            </span>
            <span className="text-xs text-muted-foreground">
              £{settings.hourlyRate}/hr <span style={{ color: `hsl(${settings.accentColor} 90% 58%)` }}>•</span> {settings.cisRate}% CIS
            </span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 font-semibold tracking-tight">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `hsl(${settings.accentColor} 90% 58% / 0.2)` }}
          >
            <Settings className="w-4 h-4" style={{ color: `hsl(${settings.accentColor} 90% 58%)` }} />
          </div>
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
        
        {/* Color Picker */}
        <ColorPicker 
          currentHue={localSettings.accentColor} 
          onChange={(hue) => setLocalSettings({ ...localSettings, accentColor: hue })} 
        />

        {/* Invoice Number */}
        <div className="space-y-3 pt-3 border-t border-border/50">
          <SectionHeader title="Invoice Number" icon={Hash} section="invoice" />
          {expandedSection === 'invoice' && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Current Invoice #</Label>
              <Input
                type="number"
                value={localInvoiceNum}
                onChange={(e) => setLocalInvoiceNum(e.target.value)}
                className="text-sm bg-secondary/50 border-border/50"
              />
            </div>
          )}
        </div>

        {/* Contractor Details */}
        <div className="space-y-3 pt-3 border-t border-border/50">
          <SectionHeader title="Contractor Details" icon={User} section="contractor" />
          {expandedSection === 'contractor' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Name</Label>
                <Input
                  value={localSettings.contractorName}
                  onChange={(e) => setLocalSettings({ ...localSettings, contractorName: e.target.value })}
                  className="text-sm bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Address</Label>
                <Input
                  value={localSettings.contractorAddress}
                  onChange={(e) => setLocalSettings({ ...localSettings, contractorAddress: e.target.value })}
                  className="text-sm bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <Input
                  value={localSettings.contractorPhone}
                  onChange={(e) => setLocalSettings({ ...localSettings, contractorPhone: e.target.value })}
                  className="text-sm bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  value={localSettings.contractorEmail}
                  onChange={(e) => setLocalSettings({ ...localSettings, contractorEmail: e.target.value })}
                  className="text-sm bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">UTR Number</Label>
                <Input
                  value={localSettings.utrNumber}
                  onChange={(e) => setLocalSettings({ ...localSettings, utrNumber: e.target.value })}
                  className="text-sm bg-secondary/50 border-border/50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Client Details */}
        <div className="space-y-3 pt-3 border-t border-border/50">
          <SectionHeader title="Client Details" icon={Building2} section="client" />
          {expandedSection === 'client' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Client Name</Label>
                <Input
                  value={localSettings.clientName}
                  onChange={(e) => setLocalSettings({ ...localSettings, clientName: e.target.value })}
                  className="text-sm bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Client Address (optional)</Label>
                <Input
                  value={localSettings.clientAddress}
                  onChange={(e) => setLocalSettings({ ...localSettings, clientAddress: e.target.value })}
                  className="text-sm bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Client Contact (optional)</Label>
                <Input
                  value={localSettings.clientContact}
                  onChange={(e) => setLocalSettings({ ...localSettings, clientContact: e.target.value })}
                  className="text-sm bg-secondary/50 border-border/50"
                  placeholder="Email or Phone"
                />
              </div>
            </div>
          )}
        </div>

        {/* Payment Settings */}
        <div className="space-y-3 pt-3 border-t border-border/50">
          <SectionHeader title="Payment Settings" icon={PoundSterling} section="payment" />
          {expandedSection === 'payment' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Hourly Rate (£)</Label>
                <Input
                  type="number"
                  value={localSettings.hourlyRate}
                  onChange={(e) => setLocalSettings({ ...localSettings, hourlyRate: parseFloat(e.target.value) || 0 })}
                  className="text-sm bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">CIS Deduction Rate (%)</Label>
                <Input
                  type="number"
                  value={localSettings.cisRate}
                  onChange={(e) => setLocalSettings({ ...localSettings, cisRate: parseFloat(e.target.value) || 0 })}
                  className="text-sm bg-secondary/50 border-border/50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bank Details */}
        <div className="space-y-3 pt-3 border-t border-border/50">
          <SectionHeader title="Bank Details" icon={CreditCard} section="bank" />
          {expandedSection === 'bank' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Account Name</Label>
                <Input
                  value={localSettings.bankAccountName}
                  onChange={(e) => setLocalSettings({ ...localSettings, bankAccountName: e.target.value })}
                  className="text-sm bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Sort Code</Label>
                <Input
                  value={localSettings.sortCode}
                  onChange={(e) => setLocalSettings({ ...localSettings, sortCode: e.target.value })}
                  className="text-sm bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Account Number</Label>
                <Input
                  value={localSettings.accountNumber}
                  onChange={(e) => setLocalSettings({ ...localSettings, accountNumber: e.target.value })}
                  className="text-sm bg-secondary/50 border-border/50"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleSave} 
            className="flex-1 btn-glow"
            style={{ background: `linear-gradient(to right, hsl(${settings.accentColor} 90% 58%), hsl(${settings.accentColor} 90% 48%))` }}
          >
            Save
          </Button>
          <Button onClick={handleCancel} variant="outline" className="flex-1 border-border/50">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
