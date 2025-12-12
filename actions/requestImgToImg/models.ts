export const model1 = `
Transformar o personagem [1] em um novo estilo descrito no prompt.

REGRA IMPORTANTE:
- Manter exatamente o mesmo layout da imagem de referência [1]
- Manter o mesmo número de poses [1]
- Manter as mesmas posições corporais e ângulos [1]
- É um sprite sheet 2D para jogos
- Recriar todas as poses com o novo estilo especificado no prompt: (ex: cartoon, dark fantasy, robô azul, monstrinho etc.)
- O personagem deve ser o mesmo em TODAS as poses (consistente  entre as poses)
- Fundo simples ou sólido (branco ou preto)

NÃO gerar imagem única.
Gerar sprite sheet completo.
Manter a variação de poses igual à referência.
Os detalhes como barba, cabelo, roupas, acessórios, cores, etc. podem ser alterados livremente para combinar com o estilo do prompt. [2]
O prompt é  :`;

export const model2 = `
Transformar o personagem [1] em um novo estilo descrito no prompt.

REGRA IMUTÁVEL:
- Manter exatamente a mesma sequência de poses da imagem de referência [1]
- Manter as mesmas posições corporais e ângulos
- O personagem deve ser o mesmo em TODAS as poses (consistente  entre as poses)
- Fundo simples ou sólido (branco ou preto)
- Não usar roupas ou acessórios da referência [1], criar novos estilos de roupas e acessórios conforme o estilo do prompt.
- NÃO gerar imagem única.

CONSIDERAR DO PROMPT APENAS:
- Os detalhes como barba, cabelo, roupas, acessórios, cores, etc. podem ser alterados livremente para combinar com o estilo do prompt. [2]

O prompt é :`;

export const model3 = `

REGRA IMUTÁVEL:
- Manter exatamente a mesma sequência de poses da imagem de referência [1]
- Manter as mesmas posições corporais e ângulos
- NÃO gerar imagem única.


O prompt é :`;

// --------------------- 
// ----- notes
// --------------------- 
// subjectType: "SUBJECT_TYPE_PERSON"
// subjectType: "SUBJECT_TYPE_ANIMAL"
// subjectType: "SUBJECT_TYPE_OBJECT"
// subjectType: "SUBJECT_TYPE_UNSPECIFIED"

// --------------------- 
// --------------------- 
// Cada imagem de referência entra como REFERENCE_TYPE_SUBJECT.
// Todos com referenceId = 1 (mesmo sujeito).
// const referenceImages = parsedRefs.map((ref) => ({
//   referenceType: "REFERENCE_TYPE_SUBJECT",
//   referenceId: 1,
//   referenceImage: {
//     bytesBase64Encoded: ref.data,
//   },
//   subjectImageConfig: {
//     subjectDescription:
//       "Personagem  humanoide 2D de lado caminhando para direita [1]. Pode ser um homem ou mulher, ou robô ou um alienígena ou um monstrinho.",
//     subjectType: "SUBJECT_TYPE_PERSON",
//   },
// }));
