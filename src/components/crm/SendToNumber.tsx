import React, { useState } from 'react';
import { Button, Input, Modal, ModalFooter, useToast } from '../ui';
import { validatePhoneNumber, formatPhoneNumber } from '../../utils/helpers';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { handleError, ValidationError, WhatsAppNotConnectedError } from '../../utils/errors';
import { t } from '../../i18n';

export interface SendToNumberProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SendToNumber: React.FC<SendToNumberProps> = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { openChat } = useWhatsApp();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Validar número
      if (!validatePhoneNumber(phoneNumber)) {
        throw new ValidationError(
          'Invalid phone number',
          'phoneNumber',
          t('features.sendToNumber.invalidNumber')
        );
      }

      setLoading(true);

      // Remover caracteres não numéricos
      const cleanNumber = phoneNumber.replace(/\D/g, '');

      // Enviar comando para content script abrir o chat
      const response = await openChat(cleanNumber);

      if (response.success) {
        // Sucesso
        toast.success(t('features.sendToNumber.success'));
        setPhoneNumber('');
        setError('');
        onClose();
      } else {
        throw new WhatsAppNotConnectedError(response.error);
      }
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);

    // Limpar erro quando usuário digita
    if (error) {
      setError('');
    }
  };

  const formatDisplayNumber = () => {
    if (phoneNumber) {
      return formatPhoneNumber(phoneNumber);
    }
    return '';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('features.sendToNumber.title')}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {t('features.sendToNumber.description')}
          </p>

          <Input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={t('features.sendToNumber.placeholder')}
            error={error}
            helperText={formatDisplayNumber()}
            fullWidth
            autoFocus
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
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
                <p className="font-medium">Dica:</p>
                <p className="mt-1">
                  Inclua o código do país e DDD. Exemplo: 5511999887766
                </p>
              </div>
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!phoneNumber || loading}
          >
            {t('features.sendToNumber.send')}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default SendToNumber;
