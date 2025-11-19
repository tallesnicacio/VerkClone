import React from 'react';
import { Modal, ModalFooter, Button, Card } from '../ui';
import { getDesktopInstructions } from '../../utils/environment';

export interface DesktopInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopInfo: React.FC<DesktopInfoProps> = ({ isOpen, onClose }) => {
  const instructions = getDesktopInstructions();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={instructions.title} size="lg">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          O Verk CRM é uma extensão Chrome e não funciona diretamente no WhatsApp Desktop nativo.
          No entanto, você pode usar as seguintes alternativas:
        </p>

        <div className="space-y-3">
          {instructions.options.map((option, index) => (
            <Card key={index} padding="md" hoverable>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-whatsapp-green text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{option.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                  {option.url && (
                    <a
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-whatsapp-green hover:underline inline-flex items-center gap-1"
                    >
                      Acessar site
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-2">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium">Recomendação:</p>
              <p className="mt-1">
                Para melhor experiência, use <strong>WhatsApp Web no Chrome</strong> ou
                <strong> Edge</strong>. É a forma mais simples e direta de usar o Verk CRM.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button variant="primary" onClick={onClose} fullWidth>
          Entendi
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DesktopInfo;
