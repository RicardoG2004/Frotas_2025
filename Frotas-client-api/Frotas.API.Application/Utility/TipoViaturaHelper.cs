using System;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Utility
{
  /// <summary>
  /// Helper para mapear designações de tipos de viatura para categorias de inspeção
  /// Porquê: Permite calcular automaticamente a categoria de inspeção baseado na designação escolhida
  /// </summary>
  public static class TipoViaturaHelper
  {
    /// <summary>
    /// Mapeia a designação do tipo de viatura para a categoria de inspeção
    /// </summary>
    /// <param name="designacao">Designação do tipo de viatura</param>
    /// <returns>Categoria de inspeção correspondente ou Ligeiro como padrão</returns>
    public static CategoriaInspecao MapearDesignacaoParaCategoriaInspecao(string? designacao)
    {
      if (string.IsNullOrWhiteSpace(designacao))
      {
        return CategoriaInspecao.Ligeiro; // Valor padrão
      }

      string designacaoLower = designacao.ToLower().Trim();

      // Mapear designações para categorias de inspeção
      if (designacaoLower == "ligeiro passageiros")
      {
        return CategoriaInspecao.Ligeiro;
      }

      if (designacaoLower == "ligeiro mercadorias")
      {
        return CategoriaInspecao.LigeiroMercadorias;
      }

      if (designacaoLower == "pesado")
      {
        return CategoriaInspecao.Pesado;
      }

      // Motociclo e tratores agrícolas não têm regras específicas de inspeção definidas
      // Retornar Ligeiro como padrão (será tratado como anual no helper de inspeção)
      if (designacaoLower == "motociclo" || designacaoLower == "tratores agricolas")
      {
        return CategoriaInspecao.Ligeiro; // Usar Ligeiro como padrão, mas será tratado como anual
      }

      // Valor padrão para designações desconhecidas
      return CategoriaInspecao.Ligeiro;
    }
  }
}

