import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

# Configuración de email desde variables de entorno
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "Sistema de Calendario Médico")
APP_NAME = os.getenv("APP_NAME", "Vitalis Stream")
APP_URL = os.getenv("APP_URL", "http://localhost:5175")

def send_email(to_email: str, subject: str, html_content: str, text_content: Optional[str] = None) -> bool:
    """
    Envía un email usando SMTP.
    
    Args:
        to_email: Email del destinatario
        subject: Asunto del email
        html_content: Contenido HTML del email
        text_content: Contenido de texto plano (opcional)
    
    Returns:
        bool: True si el email se envió exitosamente, False en caso contrario
    """
    try:
        # Verificar que las credenciales estén configuradas
        if not SMTP_USERNAME or not SMTP_PASSWORD or not SMTP_FROM_EMAIL:
            print("Error: Credenciales de email no configuradas en .env")
            return False
        
        # Crear mensaje
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
        msg['To'] = to_email
        
        # Agregar contenido de texto plano si se proporciona
        if text_content:
            text_part = MIMEText(text_content, 'plain', 'utf-8')
            msg.attach(text_part)
        
        # Agregar contenido HTML
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Conectar al servidor SMTP y enviar
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"Email enviado exitosamente a {to_email}")
        return True
        
    except Exception as e:
        print(f"Error al enviar email a {to_email}: {str(e)}")
        return False

def send_verification_email(to_email: str, verification_code: str, user_name: str) -> bool:
    """
    Envía un email de verificación con el código.
    
    Args:
        to_email: Email del destinatario
        verification_code: Código de verificación de 6 dígitos
        user_name: Nombre del usuario
    
    Returns:
        bool: True si el email se envió exitosamente
    """
    subject = f"Código de verificación - {APP_NAME}"
    
    # Contenido HTML del email
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificación de Email</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }}
            .container {{
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .logo {{
                font-size: 24px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 10px;
            }}
            .verification-code {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-size: 32px;
                font-weight: bold;
                text-align: center;
                padding: 20px;
                border-radius: 8px;
                letter-spacing: 8px;
                margin: 30px 0;
            }}
            .instructions {{
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }}
            .button {{
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                margin: 20px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">{APP_NAME}</div>
                <h1>Verificación de Email</h1>
            </div>
            
            <p>Hola <strong>{user_name}</strong>,</p>
            
            <p>Gracias por registrarte en {APP_NAME}. Para completar tu registro, necesitamos verificar tu dirección de email.</p>
            
            <p>Tu código de verificación es:</p>
            
            <div class="verification-code">
                {verification_code}
            </div>
            
            <div class="instructions">
                <strong>Instrucciones:</strong>
                <ol>
                    <li>Ve a la página de verificación de email</li>
                    <li>Ingresa el código de 6 dígitos mostrado arriba</li>
                    <li>Haz clic en "Verificar Email"</li>
                </ol>
            </div>
            
            <p>Este código expirará en <strong>24 horas</strong> por seguridad.</p>
            
            <p>Si no solicitaste esta verificación, puedes ignorar este email de forma segura.</p>
            
            <div class="footer">
                <p>Este es un email automático, por favor no respondas a este mensaje.</p>
                <p>&copy; 2024 {APP_NAME}. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Contenido de texto plano como respaldo
    text_content = f"""
    Hola {user_name},
    
    Gracias por registrarte en {APP_NAME}.
    
    Tu código de verificación es: {verification_code}
    
    Ingresa este código en la página de verificación para completar tu registro.
    
    Este código expirará en 24 horas.
    
    Si no solicitaste esta verificación, puedes ignorar este email.
    
    Saludos,
    Equipo de {APP_NAME}
    """
    
    return send_email(to_email, subject, html_content, text_content)

def send_welcome_email(to_email: str, user_name: str) -> bool:
    """
    Envía un email de bienvenida después de la verificación exitosa.
    
    Args:
        to_email: Email del destinatario
        user_name: Nombre del usuario
    
    Returns:
        bool: True si el email se envió exitosamente
    """
    subject = f"¡Bienvenido a {APP_NAME}!"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }}
            .container {{
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .logo {{
                font-size: 24px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 10px;
            }}
            .button {{
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">{APP_NAME}</div>
                <h1>¡Bienvenido!</h1>
            </div>
            
            <p>Hola <strong>{user_name}</strong>,</p>
            
            <p>¡Tu email ha sido verificado exitosamente! Ya puedes acceder a todas las funcionalidades de {APP_NAME}.</p>
            
            <p>Ahora puedes:</p>
            <ul>
                <li>Completar tu perfil profesional</li>
                <li>Configurar tu calendario de disponibilidad</li>
                <li>Gestionar tus citas médicas</li>
                <li>Y mucho más...</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="{APP_URL}/dashboard" class="button">Ir al Dashboard</a>
            </div>
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            
            <div class="footer">
                <p>Gracias por elegir {APP_NAME}</p>
                <p>&copy; 2024 {APP_NAME}. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    ¡Bienvenido a {APP_NAME}!
    
    Hola {user_name},
    
    Tu email ha sido verificado exitosamente.
    
    Ya puedes acceder a {APP_URL}/dashboard para comenzar a usar la plataforma.
    
    Gracias por elegir {APP_NAME}.
    
    Saludos,
    Equipo de {APP_NAME}
    """
    
    return send_email(to_email, subject, html_content, text_content)