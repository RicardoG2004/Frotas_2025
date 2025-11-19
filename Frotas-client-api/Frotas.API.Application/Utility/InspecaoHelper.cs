using System;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Utility
{
  /// <summary>
  /// Helper estático para calcular datas de inspeção baseado nas regras portuguesas.
  /// Centraliza a lógica de cálculo de inspeções num único local, facilitando manutenção.
  /// </summary>
  public static class InspecaoHelper
  {
    /// <summary>
    /// Calcula a data da primeira inspeção baseado na categoria de inspeção e data de matrícula.
    /// </summary>
    /// <param name="categoriaInspecao">Categoria de inspeção do tipo de viatura</param>
    /// <param name="dataLivrete">Data da matrícula (DataLivrete)</param>
    /// <returns>Data da primeira inspeção ou null se não aplicável</returns>
    public static DateTime? CalcularPrimeiraInspecao(CategoriaInspecao categoriaInspecao, DateTime? dataLivrete)
    {
      if (!dataLivrete.HasValue)
      {
        return null;
      }

      DateTime dataMatricula = dataLivrete.Value;

      return categoriaInspecao switch
      {
        CategoriaInspecao.Ligeiro => dataMatricula.AddYears(4),              // Ligeiros: primeira aos 4 anos
        CategoriaInspecao.LigeiroMercadorias => dataMatricula.AddYears(2),  // Mercadorias: primeira aos 2 anos
        CategoriaInspecao.Pesado => dataMatricula.AddYears(1),              // Pesados: primeira ao 1º ano
        _ => null
      };
    }

    /// <summary>
    /// Calcula a próxima data de inspeção baseado na categoria, data da última inspeção e data de matrícula.
    /// Considera a idade do veículo para aplicar regras diferentes (especialmente importante para Ligeiros).
    /// </summary>
    /// <param name="categoriaInspecao">Categoria de inspeção do tipo de viatura</param>
    /// <param name="dataUltimaInspecao">Data da última inspeção realizada</param>
    /// <param name="dataLivrete">Data da matrícula (DataLivrete) - necessário para calcular idade do veículo</param>
    /// <returns>Data da próxima inspeção</returns>
    public static DateTime CalcularProximaInspecao(
      CategoriaInspecao categoriaInspecao,
      DateTime dataUltimaInspecao,
      DateTime? dataLivrete)
    {
      // Se não temos data de matrícula, usar regra padrão anual
      if (!dataLivrete.HasValue)
      {
        return dataUltimaInspecao.AddYears(1);
      }

      DateTime dataMatricula = dataLivrete.Value;
      DateTime dataProximaInspecao = dataUltimaInspecao;

      switch (categoriaInspecao)
      {
        case CategoriaInspecao.Ligeiro:
          {
            // Calcular idade do veículo na data da última inspeção
            int idadeVeiculo = dataUltimaInspecao.Year - dataMatricula.Year;
            if (dataUltimaInspecao.Month < dataMatricula.Month ||
                (dataUltimaInspecao.Month == dataMatricula.Month && dataUltimaInspecao.Day < dataMatricula.Day))
            {
              idadeVeiculo--;
            }

            // Dos 4 aos 8 anos: bienal (2 em 2 anos)
            // Depois dos 8 anos: anual
            if (idadeVeiculo >= 4 && idadeVeiculo < 8)
            {
              dataProximaInspecao = dataUltimaInspecao.AddYears(2);
            }
            else if (idadeVeiculo >= 8)
            {
              dataProximaInspecao = dataUltimaInspecao.AddYears(1);
            }
            else
            {
              // Menos de 4 anos - não deveria acontecer, mas usar regra padrão
              dataProximaInspecao = dataUltimaInspecao.AddYears(1);
            }
            break;
          }

        case CategoriaInspecao.LigeiroMercadorias:
          // Ligeiros de mercadorias: inspeção todos os anos
          dataProximaInspecao = dataUltimaInspecao.AddYears(1);
          break;

        case CategoriaInspecao.Pesado:
          // Pesados: inspeção todos os anos
          dataProximaInspecao = dataUltimaInspecao.AddYears(1);
          break;

        default:
          // Regra padrão: anual
          dataProximaInspecao = dataUltimaInspecao.AddYears(1);
          break;
      }

      return dataProximaInspecao;
    }

    /// <summary>
    /// Calcula a próxima data de inspeção considerando a idade do veículo na data da inspeção.
    /// Versão alternativa que calcula a idade na data da inspeção em vez da última inspeção.
    /// </summary>
    /// <param name="categoriaInspecao">Categoria de inspeção do tipo de viatura</param>
    /// <param name="dataInspecao">Data da inspeção realizada</param>
    /// <param name="dataLivrete">Data da matrícula (DataLivrete)</param>
    /// <returns>Data da próxima inspeção</returns>
    public static DateTime CalcularProximaInspecaoPorIdade(
      CategoriaInspecao categoriaInspecao,
      DateTime dataInspecao,
      DateTime? dataLivrete)
    {
      // Se não temos data de matrícula, usar regra padrão anual
      if (!dataLivrete.HasValue)
      {
        return dataInspecao.AddYears(1);
      }

      DateTime dataMatricula = dataLivrete.Value;

      switch (categoriaInspecao)
      {
        case CategoriaInspecao.Ligeiro:
          {
            // Calcular idade do veículo na data da inspeção
            int idadeVeiculo = dataInspecao.Year - dataMatricula.Year;
            if (dataInspecao.Month < dataMatricula.Month ||
                (dataInspecao.Month == dataMatricula.Month && dataInspecao.Day < dataMatricula.Day))
            {
              idadeVeiculo--;
            }

            // Dos 4 aos 8 anos: bienal (2 em 2 anos)
            // Depois dos 8 anos: anual
            if (idadeVeiculo >= 4 && idadeVeiculo < 8)
            {
              return dataInspecao.AddYears(2);
            }
            else if (idadeVeiculo >= 8)
            {
              return dataInspecao.AddYears(1);
            }
            else
            {
              // Menos de 4 anos - não deveria acontecer, mas usar regra padrão
              return dataInspecao.AddYears(1);
            }
          }

        case CategoriaInspecao.LigeiroMercadorias:
          // Ligeiros de mercadorias: inspeção todos os anos
          return dataInspecao.AddYears(1);

        case CategoriaInspecao.Pesado:
          // Pesados: inspeção todos os anos
          return dataInspecao.AddYears(1);

        default:
          // Regra padrão: anual
          return dataInspecao.AddYears(1);
      }
    }
  }
}

