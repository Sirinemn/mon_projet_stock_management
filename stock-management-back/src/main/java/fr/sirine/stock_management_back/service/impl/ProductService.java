package fr.sirine.stock_management_back.service.impl;

import fr.sirine.stock_management_back.dto.ProductDto;
import fr.sirine.stock_management_back.entities.Category;
import fr.sirine.stock_management_back.entities.Product;
import fr.sirine.stock_management_back.entities.User;
import fr.sirine.stock_management_back.exceptions.custom.ProductAlreadyExistException;
import fr.sirine.stock_management_back.exceptions.custom.ProductNotFoundException;
import fr.sirine.stock_management_back.mapper.ProductMapper;
import fr.sirine.stock_management_back.repository.ProductRepository;
import fr.sirine.stock_management_back.service.ICategoryService;
import fr.sirine.stock_management_back.service.IProductService;
import fr.sirine.stock_management_back.service.IUserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService implements IProductService {
    private final ProductRepository productRepository;
    private final ICategoryService categoryService;
    private final IUserService userService;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository,
                          ICategoryService categoryService,
                          IUserService userService,
                          ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
        this.userService = userService;
        this.productMapper = productMapper;
    }

    public ProductDto createProduct(ProductDto productDto) {
        Product product = productMapper.toEntity(productDto);
        Category category = categoryService.findById(productDto.getCategoryId());
        Integer groupId = productDto.getGroupId();
        User user = userService.findById(productDto.getUserId());

        if (user.getGroup() == null) {
            throw new RuntimeException("L'utilisateur doit appartenir à un groupe pour créer un produit.");
        }
        if (productRepository.findByNameAndGroupId(productDto.getName(), groupId).isPresent()) {
            throw new ProductAlreadyExistException("Nom du produit déja utilisé");
        }

        product.setCategory(category);
        product.setUser(user);
        product.setGroup(user.getGroup());

        return productMapper.toDto(productRepository.save(product));
    }

    public Product findById(Integer id) {
        return productRepository.findById(id).orElseThrow(ProductNotFoundException::new);
    }
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }
    public ProductDto updateProduct(ProductDto productDto) {
        Product product = productRepository.findById(productDto.getId())
                .orElseThrow(ProductNotFoundException::new);
        Integer groupId = productDto.getGroupId();
        if (productRepository.findByNameAndGroupId(productDto.getName(), groupId)
                .filter(existingProduct -> !existingProduct.getId().equals(productDto.getId()))
                .isPresent()) {
            throw new ProductAlreadyExistException("Nom du produit déjà utilisé.");
        }

        // 🔹 Met à jour les champs
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setQuantity(productDto.getQuantity());
        product.setPrice(productDto.getPrice());

        //mettre à jour la catégorie
        Category category = categoryService.findById(productDto.getCategoryId());
        product.setCategory(category);

        return productMapper.toDto(productRepository.save(product));
    }
    public List<ProductDto> findAll() {
        return productRepository.findAll().stream()
                .map(productMapper::toDto)
                .toList();
    }
    public List<ProductDto> findAllByGroupId(Integer groupId) {
        return productRepository.findAllByGroupId(groupId).stream()
                .map(productMapper::toDto)
                .toList();
    }
    public long countByGroupId(Integer groupId) {
        return productRepository.count();
    }
    public long countByGroupIdAndQuantityLessThan(Integer groupId,int i) {
        return productRepository.countByQuantityLessThan(i);
    }

    @Override
    public boolean existsByCategoryIdAndGroupId(Integer categoryId, Integer groupId) {
        return productRepository.existsByCategoryIdAndGroupId(categoryId, groupId);
    }
    public List<ProductDto> findAllByGroupIdAndCategoryId(Integer groupId, Integer categoryId) {
        return productRepository.findAllByGroupIdAndCategoryId(groupId, categoryId).stream()
                .map(productMapper::toDto)
                .toList();
    }
}
