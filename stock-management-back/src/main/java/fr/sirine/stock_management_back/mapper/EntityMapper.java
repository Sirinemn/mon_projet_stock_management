package fr.sirine.stock_management_back.mapper;

import java.io.IOException;
import java.util.List;

public interface EntityMapper<D, E> {

    D toDto(E entity) throws IOException;
    E toEntity(D dto);

    List<E> toEntity(List<D> dtoList);

    List<D> toDto(List<E> entityList);
}
