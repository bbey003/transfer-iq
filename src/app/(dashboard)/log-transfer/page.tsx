import { TopBar } from '@/components/layout/topbar';
import { LogTransferForm } from '@/components/transfers/log-transfer-form';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function LogTransferPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Log Transfer"
        subtitle="Capture transfer details to help improve our service."
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-2xl mx-auto space-y-4">
          {/* Guidance banner */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-0.5">Before you transfer</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Please check the knowledge base and self-service options before logging a transfer. Unnecessary transfers impact team metrics.
              </p>
            </div>
          </div>

          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Transfer Details</h2>
            <LogTransferForm />
          </Card>
        </div>
      </div>
    </div>
  );
}
