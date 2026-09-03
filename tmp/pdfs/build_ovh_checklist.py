from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

OUT = r"C:\Users\Dell\OneDrive\Bureau\EsiLab\output\pdf\Checklist_OVHcloud_EsiLab.pdf"

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="TitleCustom", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=22, leading=27, textColor=colors.HexColor("#0B3D67"), spaceAfter=8,
))
styles.add(ParagraphStyle(
    name="Subtitle", parent=styles["Normal"], fontName="Helvetica",
    fontSize=10.5, leading=15, textColor=colors.HexColor("#4B5563"), spaceAfter=18,
))
styles.add(ParagraphStyle(
    name="Section", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=13, leading=16, textColor=colors.HexColor("#0B3D67"), spaceBefore=11, spaceAfter=7,
))
styles.add(ParagraphStyle(
    name="BulletText", parent=styles["Normal"], fontName="Helvetica",
    fontSize=10.5, leading=14.5, textColor=colors.HexColor("#172033"),
))
styles.add(ParagraphStyle(
    name="Note", parent=styles["Normal"], fontName="Helvetica-Oblique",
    fontSize=9.5, leading=13, textColor=colors.HexColor("#4B5563"), spaceBefore=12,
))

def bullet(text, level=0):
    indent = 17 + level * 16
    return Paragraph(f'<para leftIndent="{indent}" firstLineIndent="-10">- {text}</para>', styles["BulletText"])

def bullet_list(items):
    return items + [Spacer(1, 5)]

doc = SimpleDocTemplate(
    OUT, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm, topMargin=1.7*cm, bottomMargin=1.7*cm,
    title="Checklist OVHcloud - EsiLab",
    author="EsiLab",
)

story = [
    Paragraph("Checklist de mise en place OVHcloud", styles["TitleCustom"]),
    Paragraph("EsiLab - Actions a realiser par le client avant le deploiement du site", styles["Subtitle"]),
    Paragraph("1. Compte et serveur", styles["Section"]),
    bullet_list([
        bullet("Creez un compte OVHcloud en utilisant l'adresse e-mail et les informations de paiement de l'entreprise."),
        bullet("Achetez un VPS OVHcloud, et non un hebergement mutualise."),
        bullet("Choisissez Ubuntu 24.04 LTS."),
        bullet("Choisissez au minimum 2 vCPU, 4 Go de RAM et 80 Go de stockage SSD/NVMe."),
        bullet("Choisissez le centre de donnees le plus proche de la Tunisie et de vos clients. La France convient generalement."),
    ]),
    Paragraph("2. Nom de domaine et DNS", styles["Section"]),
    bullet_list([
        bullet("Enregistrez ou transferez le nom de domaine, de preference <b>esilab.tn</b>, s'il n'est pas deja enregistre."),
        bullet("Confirmez le nom de domaine public souhaite avant le deploiement."),
        bullet("Assurez-vous que je puisse gerer la zone DNS du domaine. Les enregistrements necessaires seront :"),
        bullet("esilab.tn", 1),
        bullet("www.esilab.tn", 1),
        bullet("api.esilab.tn", 1),
        bullet("admin.esilab.tn", 1),
    ]),
    Paragraph("3. Acces technique", styles["Section"]),
    bullet_list([
        bullet("Donnez-moi acces de maniere securisee : ajoutez-moi comme contact technique/utilisateur dans OVHcloud Manager, ou envoyez-moi des identifiants SSH temporaires et securises pour le VPS."),
        bullet("Ne partagez pas le mot de passe du compte OVH par WhatsApp ou e-mail."),
        bullet("Fournissez une adresse e-mail destinee aux notifications techniques, de securite et de renouvellement des certificats."),
    ]),
    Paragraph("4. Sauvegardes et propriete", styles["Section"]),
    bullet_list([
        bullet("Activez ou achetez les sauvegardes/snapshots automatiques du VPS."),
        bullet("Conservez le compte OVH, l'adresse e-mail de facturation, le moyen de paiement et la propriete du domaine au nom du client/de l'entreprise, et non sur mon compte personnel."),
    ]),
    Paragraph("A m'envoyer une fois le VPS cree", styles["Section"]),
    bullet_list([
        bullet("L'adresse IP publique du VPS."),
        bullet("La version d'Ubuntu installee."),
        bullet("Mon nom d'utilisateur SSH et la methode d'acces temporaire."),
        bullet("La confirmation de mon acces a la gestion DNS."),
        bullet("Le nom de domaine choisi."),
    ]),
    Spacer(1, 6),
    Paragraph("Une fois ces elements recus, le serveur pourra etre configure, securise et le projet EsiLab deploye.", styles["Note"]),
]

flat_story = []
for item in story:
    if isinstance(item, list):
        flat_story.extend(item)
    else:
        flat_story.append(item)
doc.build(flat_story)
