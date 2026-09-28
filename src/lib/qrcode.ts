import QRCode from 'qrcode'

export async function generateQRCode(url: string): Promise<string> {
  const options: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    margin: 2,
    width: 400,
    color: {
      dark: '#1A0F08',
      light: '#FDFAF5',
    },
  }
  return QRCode.toDataURL(url, options)
}

export async function generateQRSVG(url: string): Promise<string> {
  const options: QRCode.QRCodeToStringOptions = {
    errorCorrectionLevel: 'H',
    type: 'svg',
    margin: 2,
    color: {
      dark: '#1A0F08',
      light: '#FDFAF5',
    },
  }
  return QRCode.toString(url, options)
}
