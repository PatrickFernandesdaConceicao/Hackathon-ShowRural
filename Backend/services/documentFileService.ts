import { User } from "../entities/user";
import { PrismaDB } from "../prisma/client";
import pdf from "pdf-parse";
import { DocumentFileRepositorie } from "../repositorie/documentFileRepositorie";
import { DocumentFile } from "../entities/documentFile";
import { DocumentRepositorie } from "../repositorie/documentRepositorie";
import { Document } from "@prisma/client";

export class DocumentFileService {
    
    static async create(data: DocumentFile) {
        try {
            if (!data.document_pdf) {
                throw new Error("Arquivo PDF inválido ou não fornecido.");
            }

            // Converte Uint8Array para Buffer
            const buffer = Buffer.from(data.document_pdf);

            // Extrai texto do PDF
            const pdfData = await pdf(buffer);
            const extractedText = pdfData.text;

            // Extrai as informações relevantes
            const extractedData = extractRelevantInfo(extractedText) as Omit<Omit<Document, "id">, "title">;

            const newDocumentFile = await DocumentFileRepositorie.create(data);
            const newDocument = await DocumentRepositorie.create({
                ...extractedData,
                id: newDocumentFile.id,
                title: `${extractedData.corporate_reason} - ${extractedData.cpf_cnpj}`
            });

            return newDocument
        } catch (error) {
            console.error("Erro ao processar PDF:", error);
            throw new Error("Falha ao processar o arquivo PDF.");
        }
    }

    static async findById(id: string) {
        if(!id) throw new Error("Id doesn't sended!");

        const document = await DocumentFileRepositorie.findById(id);

        return { buffer: document?.document_pdf};
    }
}

// Função para extrair dados relevantes usando regex
function extractRelevantInfo(text: string) {
    // Divide o texto em linhas
    const lines = text.split('\n');

    // Objeto para armazenar os dados extraídos
    const extractedData: { [key: string]: string | null } = {
        num_protocol: null,
        num_documento: null,
        expirate_date: null,
        cpf_cnpj: null,
        corporate_reason: null,
        specific_activity: null,
        conditions: null,
    };

    // Regex para capturar o número do protocolo (padrão: "16.986.636-8")
    const protocoloRegex = /\b\d{2}\.\d{3}\.\d{3}-\d{1}\b/;
    // Regex para capturar o número do documento (padrão: "223445")
    const documentoRegex = /\b\d{6}\b/;
    // Regex para capturar CNPJ no formato 76.09*.***/****-**
    const cnpjRegex = /76\.09\*\.\*\*\*\/\*\*\*\*-\*\*/;

    // Itera sobre as linhas para extrair os dados
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Captura o número do protocolo
        const protocoloMatch = line.match(protocoloRegex);
        if (protocoloMatch) {
            extractedData.num_protocol = protocoloMatch[0];
        }

        // Captura o número do documento
        const documentoMatch = line.match(documentoRegex);
        if (documentoMatch) {
            extractedData.num_documento = documentoMatch[0];
        }

        // Captura o CNPJ no formato 76.09*.***/****-**
        const cnpjMatch = line.match(cnpjRegex);
        if (cnpjMatch) {
            // Remove qualquer texto adicional após o CNPJ
            extractedData.cpf_cnpj = cnpjMatch[0];
        }

        if (line.startsWith("Validade da Licença")) {
            // A próxima linha contém o valor da validade da licença
            extractedData.expirate_date = lines[i + 1].trim();
        } else if (line.startsWith("1. IDENTIFICAÇÃO DO EMPREENDEDOR")) {
            // A próxima linha contém o CNPJ/CPF e a razão social
            const identificacaoLine = lines[i + 1].trim();
            // Se o CNPJ não foi capturado anteriormente, tenta capturar aqui
            if (!extractedData.cpf_cnpj) {
                const cnpjMatch = identificacaoLine.match(cnpjRegex);
                if (cnpjMatch) {
                    // Remove qualquer texto adicional após o CNPJ
                    extractedData.cpf_cnpj = cnpjMatch[0];
                }
            }
            // Captura a razão social (tudo após o CNPJ)
            extractedData.corporate_reason = identificacaoLine.replace(cnpjRegex, '').trim();
        } else if (line.startsWith("Atividade Específica")) {
            // A próxima linha contém o valor da atividade específica
            extractedData.specific_activity = lines[i + 1].trim();
        } else if (
            line.startsWith("1. CONDICIONANTES") ||
            line.startsWith("2. CONDICIONANTES") ||
            line.startsWith("3. CONDICIONANTES") ||
            line.startsWith("4. CONDICIONANTES") ||
            line.startsWith("5. CONDICIONANTES") ||
            line.startsWith("6. CONDICIONANTES") ||
            line.startsWith("7. CONDICIONANTES") ||
            line.startsWith("8. CONDICIONANTES") ||
            line.startsWith("9. CONDICIONANTES") ||
            line.startsWith("10. CONDICIONANTES")
        ) {
            // Captura todas as linhas após "4. CONDICIONANTES" até o próximo título ou final do texto
            let conditions = [];
            for (let j = i + 1; j < lines.length; j++) {
                const currentLine = lines[j].trim();
                if (currentLine.startsWith("Assinatura")) {
                    break; // Para ao encontrar "Assinatura" ou o próximo título
                }
                conditions.push(currentLine);
            }
            extractedData.conditions = conditions
                .filter(line => !line.includes('EM BRANCO')) // Remove linhas com "EM BRANCO"
                .join('\n') // Junta as linhas em um único texto
                .trim(); // Remove espaços extras
        }
    }

    return extractedData;
}