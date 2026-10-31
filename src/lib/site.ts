/**
 * O endereço público do site, num lugar só: prévias de link, cartões de compartilhar e o script de
 * links de divulgação (`npm run link`). Sem barra no fim.
 */
export const SITE = 'https://tramabr.app';

/** O endereço sem o protocolo, como aparece escrito nas imagens ("tramabr.app"). */
export const SITE_CURTO = SITE.replace(/^https?:\/\//, '');

/** Link com a origem marcada, para contar quantos chegam por cada canal. */
export const linkCom = (origem: string, caminho = '/') => `${SITE}${caminho}?origem=${origem}`;
