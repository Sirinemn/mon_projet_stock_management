package fr.sirine.stock_management_back.controller;

import fr.sirine.stock_management_back.dto.CategoryDto;
import fr.sirine.stock_management_back.service.ICategoryService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategorieController {
    private final ICategoryService categoryService;

    public CategorieController(ICategoryService categoryService) {
        this.categoryService = categoryService;
    }
    @Operation(summary = "Get all categories", description = "Retrieve a list of all categories")
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories(@RequestParam("groupId") @Valid Integer groupId) {
        List<CategoryDto> categories = categoryService.getAllCategories(groupId);
        return ResponseEntity.ok(categories);
    }
}
